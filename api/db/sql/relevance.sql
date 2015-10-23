CREATE OR REPLACE FUNCTION relevance(distance float, category int) RETURNS float as $$
      DECLARE
        category_relevance float;
        category_relevance_weight float := 0.5;

        category_diameter float;
        distance_relevance float;
        distance_relevance_weight float := 0.5;

        exponent float;

      BEGIN
        CASE category
        WHEN 1 THEN -- continent
          category_relevance := 0.35;
          category_diameter := 1000.0 * 10000.0; -- meters
        WHEN 2 THEN -- country
          category_relevance := 0.4;
          category_diameter := 1000.0 * 5000.0;
        WHEN 3 THEN -- region
          category_relevance := 0.5;
          category_diameter := 1000.0 * 500.0;
        WHEN 4 THEN -- county
          category_relevance := 0.5;
          category_diameter := 1000.0 * 50.0;
        WHEN 5 THEN -- locality
          category_relevance := 1;
          category_diameter := 1000.0 * 10.0;
        WHEN 6 THEN -- neighborhood
          category_relevance := 1;
          category_diameter := 1000.0 * 1.0;
        ELSE
          raise EXCEPTION 'unknown place category';
        END CASE;

        --        Distance to Place vs. Relevance 
        --
        -- relevance
        --   1 |------------\
        --     |              \
        --   0 |________________\______
        --     |        |       |   |
        --     0        d1      c   d2     c=category_diameter e.g. the width of Kentucky
        -- in this example, d1 is most relevant (1) and d2 is not relevant at all (0)

        IF distance BETWEEN 0 and category_diameter THEN
          distance_relevance := 1 - exp(distance/category_diameter - 1);
        ELSE
          distance_relevance := 0;
        END IF;

        RETURN (distance_relevance_weight * distance_relevance + category_relevance_weight * category_relevance)/2.0;
      END

      $$ LANGUAGE plpgsql;
