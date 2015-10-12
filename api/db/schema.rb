# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151009173019) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "places", force: :cascade do |t|
    t.text     "name",                                                              null: false
    t.boolean  "is_authoritative",                                                  null: false
    t.string   "import_source"
    t.jsonb    "import_metadata"
    t.geometry "authoritative_boundary", limit: {:srid=>0, :type=>"multi_polygon"}
    t.datetime "created_at",                                                        null: false
    t.datetime "updated_at",                                                        null: false
  end

  add_index "places", ["is_authoritative"], name: "index_places_on_is_authoritative", using: :btree
  add_index "places", ["name"], name: "index_places_on_name", using: :btree

end
