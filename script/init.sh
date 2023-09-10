# Init de la db

export PGUSER=postgres

## suppression de l'existant
dropdb recipesite
dropuser admin_recipe
dropuser member_recipe

## ajout du role et de la bdd
psql -f ./sql/init_db.sql

## suppression du schéma public
psql -d recipesite -f ./sql/delete_public.sql

## ajout des tables
export PGUSER=admin_recipe
export PGPASSWORD=space
export PGDATABASE=cheast2609!!

psql -f ./sql/create_tables.sql