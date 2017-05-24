CREATE OR REPLACE FUNCTION category_relevance(category int) RETURNS float as $$
DECLARE
relevance float;
BEGIN
  CASE category
  WHEN 1 THEN -- continent
    relevance := 0.25;
  WHEN 2 THEN -- country
    relevance := 0.35;
  WHEN 3 THEN -- region
    relevance := 0.35;
  WHEN 4 THEN -- county
    relevance := 0.4;
  WHEN 5 THEN -- locality
    relevance := 0.8;
  WHEN 6 THEN -- neighborhood
    relevance := 0.8;
  WHEN 7 THEN -- user defined
    relevance := 1;
  ELSE
    raise EXCEPTION 'unknown place category: %', category;
  END CASE;

  return relevance;
END
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION distance_relevance(distance float, place_diameter float) RETURNS float as $$
DECLARE

relevance float;
peek_ahead float;

BEGIN
  IF place_diameter <= 50 THEN
    peek_ahead := 4.662;
  ELSIF place_diameter <= 100 THEN
    peek_ahead := 3.1;
  ELSIF place_diameter <= 1000 THEN
    peek_ahead := 0.155;
  ELSIF place_diameter <= 10000 THEN
    peek_ahead := 0.155;
  ELSIF place_diameter <= 100000 THEN
    peek_ahead := 0.01;
  ELSIF place_diameter <= 1000000 THEN
    peek_ahead := 0.0155;
  ELSE
    peek_ahead := 0.003105;
  END IF;

  IF distance = 0.0 THEN
    relevance := 1;
  ELSIF (place_diameter * peek_ahead) = 0.0  THEN
    relevance := 0;
  ELSIF distance BETWEEN 0 AND (place_diameter * peek_ahead) THEN
    -- based on a butterworth lowpass filter
    relevance := (1 / (sqrt( (4/9.0) + ((distance + (place_diameter * peek_ahead) / 6) / (place_diameter * peek_ahead) ) ^ 8 ))) - 0.5;
  ELSE
    relevance := 0;
  END IF;

  return relevance;
END
$$ LANGUAGE plpgsql STABLE;



CREATE OR REPLACE FUNCTION relevance(distance float, category int, place_diameter float) RETURNS float as $$
DECLARE
category_relevance_weight float := 0.5;
distance_relevance_weight float := 0.5;

BEGIN

  RETURN (distance_relevance_weight * distance_relevance(distance, place_diameter) 
    + category_relevance_weight * category_relevance(category));
END

$$ LANGUAGE plpgsql IMMUTABLE;
