--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET search_path = public, pg_catalog;

--
-- Name: category_relevance(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION category_relevance(category integer) RETURNS double precision
    LANGUAGE plpgsql
    AS $$
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
    raise EXCEPTION 'unknown place category: %', category;
  END CASE;

  return relevance;
END
$$;


--
-- Name: distance_relevance(double precision, double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION distance_relevance(distance double precision, place_diameter double precision) RETURNS double precision
    LANGUAGE plpgsql
    AS $$
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

$$;


--
-- Name: place_calculate_boundary(geometry, geometry); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION place_calculate_boundary(authoritative_boundary geometry, visits geometry) RETURNS geometry
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- Name: relevance(double precision, integer, double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION relevance(distance double precision, category integer, place_diameter double precision) RETURNS double precision
    LANGUAGE plpgsql
    AS $$
DECLARE
category_relevance_weight float := 0.5;
distance_relevance_weight float := 0.5;

BEGIN

  RETURN (distance_relevance_weight * distance_relevance(distance, place_diameter) 
    + category_relevance_weight * category_relevance(category));
END

$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: places; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE places (
    id integer NOT NULL,
    name text NOT NULL,
    is_authoritative boolean NOT NULL,
    import_source character varying,
    import_metadata jsonb,
    authoritative_boundary geometry(MultiPolygon,4326) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    category_id integer NOT NULL,
    boundary geometry(MultiPolygon,4326) NOT NULL
);


--
-- Name: places_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE places_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE places_id_seq OWNED BY places.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


--
-- Name: visits; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE visits (
    id integer NOT NULL,
    place_id integer NOT NULL,
    location geometry(Point,4326) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE visits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE visits_id_seq OWNED BY visits.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY places ALTER COLUMN id SET DEFAULT nextval('places_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY visits ALTER COLUMN id SET DEFAULT nextval('visits_id_seq'::regclass);


--
-- Name: places_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY places
    ADD CONSTRAINT places_pkey PRIMARY KEY (id);


--
-- Name: visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- Name: index_places_on_is_authoritative; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_places_on_is_authoritative ON places USING btree (is_authoritative);


--
-- Name: index_places_on_name; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_places_on_name ON places USING btree (name);


--
-- Name: index_visits_on_location; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_visits_on_location ON visits USING gist (location);


--
-- Name: index_visits_on_place_id; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_visits_on_place_id ON visits USING btree (place_id);


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE UNIQUE INDEX unique_schema_migrations ON schema_migrations USING btree (version);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user",public;

INSERT INTO schema_migrations (version) VALUES ('20151009173019');

INSERT INTO schema_migrations (version) VALUES ('20151013170030');

INSERT INTO schema_migrations (version) VALUES ('20151013184933');

INSERT INTO schema_migrations (version) VALUES ('20151022204943');

INSERT INTO schema_migrations (version) VALUES ('20151105181300');

INSERT INTO schema_migrations (version) VALUES ('20151105182655');

INSERT INTO schema_migrations (version) VALUES ('20151106170659');

INSERT INTO schema_migrations (version) VALUES ('20151106172430');

INSERT INTO schema_migrations (version) VALUES ('20151106222532');

INSERT INTO schema_migrations (version) VALUES ('20151111172646');

INSERT INTO schema_migrations (version) VALUES ('20151111215203');

