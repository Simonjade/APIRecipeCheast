-- Function for insert a user
CREATE OR REPLACE FUNCTION web.insert_user(u json) RETURNS TABLE (id int, firstname text, lastname text, mail text) AS $$

    INSERT INTO administration.user
    (firstname, lastname, mail, password)
    VALUES
    (
        u->>'firstname',
        u->>'lastname',
        u->>'mail',
        u->>'password'
    )
    RETURNING id, firstname, lastname, mail;
    $$ LANGUAGE sql SECURITY DEFINER;

-- Function for delete a user
CREATE OR REPLACE FUNCTION web.delete_user(id_user int) RETURNS boolean AS $$
DECLARE
    id_selected int;
    temprow record;
BEGIN
    SELECT id INTO id_selected
    FROM administration.user
    WHERE id = id_user;

    IF FOUND THEN
        DELETE FROM administration.user
        WHERE id = id_selected;
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for update a user
CREATE OR REPLACE FUNCTION web.update_user(u json) RETURNS administration.user AS $$
DECLARE
    user_db administration.user;
BEGIN
    
    SELECT id, email, pseudo, email
    INTO user_db
    FROM administration.user WHERE id=(u->>'id')::int;
	
	IF NOT FOUND THEN
        -- Handle the case where the user record does not exist
        RAISE EXCEPTION 'User with ID % not found', (u->>'id')::int;
    END IF;

    IF u->>'pseudo' IS NOT NULL
    THEN 
    user_db.pseudo = u->>'pseudo';
    END IF;

    IF u->>'email' IS NOT NULL
    THEN 
    user_db.email = u->>'email';
    END IF;

    UPDATE administration.user
    SET pseudo = user_db.pseudo, email = user_db.email
    WHERE id = (u->> 'id')::int;

    RETURN user_db;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION web.check_user(u json) RETURNS administration.user AS $$
	SELECT *
	FROM administration.user
	WHERE mail=u->>'mail';

$$ LANGUAGE sql SECURITY DEFINER;