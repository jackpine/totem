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
-- Name: relevance(double precision, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION relevance(distance double precision, category integer) RETURNS double precision
    LANGUAGE plpgsql
    AS $$
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
    authoritative_boundary geometry(MultiPolygon,4326),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    category integer
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
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY places ALTER COLUMN id SET DEFAULT nextval('places_id_seq'::regclass);


--
-- Name: places_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY places
    ADD CONSTRAINT places_pkey PRIMARY KEY (id);


--
-- Name: index_places_on_is_authoritative; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_places_on_is_authoritative ON places USING btree (is_authoritative);


--
-- Name: index_places_on_name; Type: INDEX; Schema: public; Owner: -; Tablespace: 
--

CREATE INDEX index_places_on_name ON places USING btree (name);


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

