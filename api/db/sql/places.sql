CREATE OR REPLACE FUNCTION place_calculate_boundary(authoritative_boundary geometry, visits geometry) RETURNS geometry as $$
DECLARE
relevance float;
i integer;
j integer;
min_distance float;
tmp_distance float;
closest_poly integer;
new_boundary geometry;
tmp_hull geometry;

-- in points case
visit_centroid geometry;
BEGIN

  IF ST_NumGeometries(visits) IS NULL THEN
    RAISE EXCEPTION 'There must be at least one visit';
  END IF;

  IF ST_NumGeometries(authoritative_boundary) IS NULL THEN
    visit_centroid = ST_SetSRID(ST_Centroid(visits), 4326);
    IF ST_NumGeometries(visits) < 3 THEN
      -- a quick way to calculate 15 meters instead of degrees
      return ST_Multi(ST_Transform(ST_Buffer(ST_Transform(visit_centroid,
                                                         3857),
                                            15),
                                  4326));
    ELSE
      return ST_ConvexHull(visit_centroid);
    END IF;
  END IF;

  -- extend existing geometries using a convex hull
  new_boundary = ST_GeomFromText('MULTIPOLYGON EMPTY');
  i = 1;
  WHILE i <=  ST_NumGeometries(visits) LOOP

    min_distance = 'Infinity';
    j = 1;
    WHILE j <=  ST_NumGeometries(authoritative_boundary) LOOP
      tmp_distance = ST_Distance(ST_GeometryN(visits, i), ST_GeometryN(authoritative_boundary, j));

      if tmp_distance < min_distance THEN
        min_distance = tmp_distance;
        closest_poly = j;
      END IF;

      j = j + 1;
    END LOOP;
    tmp_hull =  ST_ConvexHull(ST_Collect(ST_GeometryN(visits, i), ST_GeometryN(authoritative_boundary, closest_poly)));
    new_boundary = ST_Multi(ST_Union(new_boundary, tmp_hull));


    i = i + 1;
  END LOOP;

  return new_boundary;
END
$$ LANGUAGE plpgsql;
