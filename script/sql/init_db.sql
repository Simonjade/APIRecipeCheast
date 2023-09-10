-- je crèe le rôle "admin_recipe" qui a tous les droits
CREATE ROLE admin_recipe WITH LOGIN PASSWORD 'cheast2609!!';

-- je crèe le rôle "member_recipe" qui sera le compte utilisé par notre solution NodeJS pour se connecter à la bdd
CREATE ROLE member_recipe WITH LOGIN PASSWORD 'recipe1304!!';

-- création des groupes
CREATE ROLE recipe_group_web;
CREATE ROLE recipe_group_administration;

-- ajout dans les groupes
GRANT recipe_group_web TO member_recipe;
GRANT recipe_group_web TO admin_recipe;

GRANT recipe_group_administration TO admin_recipe;

-- je crèe la BDD "spacevoyager"
CREATE DATABASE recipesite OWNER admin_recipe;