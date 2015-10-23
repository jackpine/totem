CREATE OR REPLACE FUNCTION relevance(distance float, category int) RETURNS float as $$
      DECLARE
        category_relevance_scale float;
        category_relevance_weight float := 0.5;

        category_distance_scale float;
        distance_relevance_scale float;
        distance_relevance_weight float := 0.5;

        exponent float;

      BEGIN
        CASE category
        WHEN 1 THEN -- continent
          category_relevance_scale := 0;
          category_distance_scale := 1000.0 * 10000.0; -- meters
        WHEN 2 THEN -- country
          category_relevance_scale := 0;
          category_distance_scale := 1000.0 * 5000.0;
        WHEN 3 THEN -- region
          category_relevance_scale := 0.5;
          category_distance_scale := 1000.0 * 500.0;
        WHEN 4 THEN -- county
          category_relevance_scale := 0.5;
          category_distance_scale := 1000.0 * 50.0;
        WHEN 5 THEN -- locality
          category_relevance_scale := 1;
          category_distance_scale := 1000.0 * 10.0;
        WHEN 6 THEN -- neighborhood
          category_relevance_scale := 1;
          category_distance_scale := 1000.0 * 1.0;
        ELSE
          raise EXCEPTION 'unknown place category';
        END CASE;

        --   1 |------------\
        --     |              \
        --   0 |________________\
        --     |                |
        --     0                d  d=category_distance_scale e.g. continent

        IF distance BETWEEN 0 and category_distance_scale THEN
          distance_relevance_scale := 1 - exp(distance/category_distance_scale - 1);
        ELSE
          distance_relevance_scale := 0;
        END IF;

        RETURN (distance_relevance_weight * distance_relevance_scale + category_relevance_weight * category_relevance_scale)/2.0;
      END

      $$ LANGUAGE plpgsql;
