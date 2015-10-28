CREATE OR REPLACE FUNCTION category_relevance(category int) RETURNS float as $$
DECLARE
relevance float;
BEGIN
  CASE category
  WHEN 1 THEN -- continent
    relevance := 0.35;
  WHEN 2 THEN -- country
    relevance := 0.45;
  WHEN 3 THEN -- region
    relevance := 0.45;
  WHEN 4 THEN -- county
    relevance := 0.5;
  WHEN 5 THEN -- locality
    relevance := 1;
  WHEN 6 THEN -- neighborhood
    relevance := 1;
  ELSE
    raise EXCEPTION 'unknown place category';
  END CASE;

  return relevance;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION distance_relevance(distance float, place_diameter float) RETURNS float as $$
DECLARE
relevance float;
BEGIN
  IF distance BETWEEN 0 and place_diameter THEN
    relevance := 2 / (exp(50*(distance/place_diameter)) + 1);
  ELSE
    relevance := 0;
  END IF;

  return relevance;
END

$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION relevance(distance float, category int, place_diameter float) RETURNS float as $$
DECLARE
category_relevance_weight float := 0.5;
distance_relevance_weight float := 0.5;

BEGIN

  RETURN (distance_relevance_weight * distance_relevance(distance, place_diameter) 
    + category_relevance_weight * category_relevance(category));
END

$$ LANGUAGE plpgsql;
