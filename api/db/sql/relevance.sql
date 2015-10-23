CREATE OR REPLACE FUNCTION relevance(distance float, category int, place_diameter float) RETURNS float as $$
      DECLARE
        category_relevance float;
        category_relevance_weight float := 0.5;

        distance_relevance float;
        distance_relevance_weight float := 0.5;

        exponent float;

      BEGIN
        CASE category
        WHEN 1 THEN -- continent
          category_relevance := 0.35;
        WHEN 2 THEN -- country
          category_relevance := 0.45;
        WHEN 3 THEN -- region
          category_relevance := 0.45;
        WHEN 4 THEN -- county
          category_relevance := 0.5;
        WHEN 5 THEN -- locality
          category_relevance := 1;
        WHEN 6 THEN -- neighborhood
          category_relevance := 1;
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
        --     0        d1      c   d2     c=place_diameter e.g. the width of Kentucky
        -- in this example, d1 is most relevant (1) and d2 is not relevant at all (0)

        IF distance BETWEEN 0 and place_diameter THEN
          distance_relevance := 2 / (exp(50*(distance/place_diameter)) + 1);
        ELSIF distance > place_diameter THEN
          -- if the distance compared to place_diameter is too great, then punt
          -- e.g. if I am more than 2.5 km from the border of a town that is 5 km wide.
          RETURN 0.0;
        ELSE
          distance_relevance := 0;
        END IF;

        RETURN (distance_relevance_weight * distance_relevance + category_relevance_weight * category_relevance);
      END

      $$ LANGUAGE plpgsql;
