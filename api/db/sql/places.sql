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

BEGIN
  RAISE NOTICE 'IN place calc boundary, num pts: %', ST_NumGeometries(visits);

  if ST_NumGeometries(visits) IS NULL THEN
    RAISE EXCEPTION 'There must be at least one visit';
  END IF;
  if ST_NumGeometries(authoritative_boundary) IS NULL THEN
    RAISE EXCEPTION 'There must be at least one authoritative bounding polygon';
  END IF;

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

      RAISE NOTICE 'point %', ST_AsText(ST_GeometryN(visits, i));
      RAISE NOTICE 'polygon %', ST_AsText(ST_GeometryN(authoritative_boundary, i));
      RAISE NOTICE 'distance from % % %', i,j, tmp_distance;
      j = j + 1;
    END LOOP;
    RAISE NOTICE '******* for visit % the closest poly is %', i, closest_poly;
    tmp_hull =  ST_ConvexHull(ST_Collect(ST_GeometryN(visits, i), ST_GeometryN(authoritative_boundary, closest_poly)));
    RAISE NOTICE 'tmp_hull? %', ST_AsText(tmp_hull);
    new_boundary = ST_Multi(ST_Union(new_boundary, tmp_hull));


    i = i + 1;
  END LOOP;

  return new_boundary;
END
$$ LANGUAGE plpgsql;
