# API Recipe Cheast

:bangbang: :bangbang: This project is currently under construction/refactoring. Since the beginning of this project, I have evolved in my use of SQL, and new things are therefore being implemented like functions in SQL or PL/pgSQL for all request, unit test, use of schema in my bdd, and JWT authentication.

This API was made for a personal project, a website where you can share your recipe with a group, your family, your friend. Several route was made. The notice was outside.

## Register

### router.post("/user")

This route was to register a user in the BDD.

## Login

### router.post("user/login")

This route was to login a user in the session

## User

### router.get("/user")

With this route, you can have all information about the loggin user (for exemple for a profile). The user have to be connected and the session start to find the user in the BDD with a pseudo

### router.patch ("/user)

With this route, update user information. The user have to be connected to update his profil

## Recipe CRUD

### router.post("/recipe")

With a form, you can fetch this route to add recipe to the BDD. It also add etap, ingredient and quantity associated in the BDD.

### router.patch("/recipe/:recipeId")

Update the recipe. You can update etape, ingredient and quantity of the recipe

### router.delete("/recipe/:recipeId")

A connected user can delete a recipe, for exemple with a button delete

### router.get("/recipe/:recipeId")

With this route, you can fetch all this information of a specific recipe

### router.get("/recipe/:userPseudo")

Get all the recipe of a specific user by is pseudo

### router.get("group/:groupId/recipe/")

Get all the recipe of a specific group

## Group CRUD

### router.get("/group/:groupId")

Get all information about a group, it's include all the user in the group and all the recipe

### router.get("/group/:UserId")

With this route, you can have all the group of a specific user

### router.post("/group")

With this route, you can create a group and save him in the BDD. The groupe have to be created by a login user.

### router.post("/group/:groupId/:userPseudo")

With this route, with a fetch, you can add a user in a specific group.

### router.delete("/group/:groupId/:userId")

With this route, with a fetch, you can delete the link between a user and a specific group.
