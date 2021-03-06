--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

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
    LANGUAGE plpgsql STABLE
    AS $$
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
$$;


--
-- Name: distance_relevance(double precision, double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION distance_relevance(distance double precision, place_diameter double precision) RETURNS double precision
    LANGUAGE plpgsql STABLE
    AS $$
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
      -- union a 15 meter circle with the visits before the convex hull is calculated
      -- so that we always have a non point polygon
      return ST_Multi(ST_ConvexHull(ST_Union(visits, ST_Multi(ST_Transform(ST_Buffer(ST_Transform(visit_centroid,
                                                         3857),
                                            15),
                                  4326)))));
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
$$;


--
-- Name: relevance(double precision, integer, double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION relevance(distance double precision, category integer, place_diameter double precision) RETURNS double precision
    LANGUAGE plpgsql IMMUTABLE
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
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE messages (
    id integer NOT NULL,
    place_id integer,
    user_id integer,
    subject character varying,
    body text,
    flagged_count integer DEFAULT 0,
    location geometry(Point,4326) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    visit_id integer
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE messages_id_seq OWNED BY messages.id;


--
-- Name: places; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE places (
    id integer NOT NULL,
    name text NOT NULL,
    is_authoritative boolean NOT NULL,
    import_source character varying,
    import_metadata jsonb,
    authoritative_boundary geometry(MultiPolygon,4326),
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
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    public_token character varying NOT NULL,
    private_token character varying NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: visits; Type: TABLE; Schema: public; Owner: -
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
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY messages ALTER COLUMN id SET DEFAULT nextval('messages_id_seq'::regclass);


--
-- Name: places id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY places ALTER COLUMN id SET DEFAULT nextval('places_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY visits ALTER COLUMN id SET DEFAULT nextval('visits_id_seq'::regclass);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: places places_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY places
    ADD CONSTRAINT places_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- Name: index_places_on_boundary; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_places_on_boundary ON places USING gist (boundary);


--
-- Name: index_places_on_boundary_width; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_places_on_boundary_width ON places USING btree (st_length(st_longestline(boundary, boundary)));


--
-- Name: index_places_on_is_authoritative; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_places_on_is_authoritative ON places USING btree (is_authoritative);


--
-- Name: index_places_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_places_on_name ON places USING btree (name);


--
-- Name: index_places_on_simplified_boundary; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_places_on_simplified_boundary ON places USING gist (st_simplify(boundary, (0.01)::double precision, true));


--
-- Name: index_places_on_simplified_boundary_geography; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_places_on_simplified_boundary_geography ON places USING gist (((st_simplify(boundary, (0.01)::double precision, true))::geography));


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON users USING btree (reset_password_token);


--
-- Name: index_visits_on_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_visits_on_location ON visits USING gist (location);


--
-- Name: index_visits_on_place_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_visits_on_place_id ON visits USING btree (place_id);


--
-- Name: index_wof_id_on_places; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_wof_id_on_places ON places USING btree ((((import_metadata ->> 'wof:id'::text))::integer));


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_schema_migrations ON schema_migrations USING btree (version);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20151009173019'),
('20151013170030'),
('20151013184933'),
('20151022204943'),
('20151105181300'),
('20151105182655'),
('20151106170659'),
('20151106172430'),
('20151106222532'),
('20151111172646'),
('20151111215203'),
('20151113171813'),
('20151113172347'),
('20151203164752'),
('20151203175150'),
('20151203183249'),
('20160614192525'),
('20160805155451'),
('20161028174301'),
('20170411035121'),
('20170423203349'),
('20170423215902'),
('20170505135258'),
('20170510044448'),
('20170518034531'),
('20170523150916'),
('20170525193503');


