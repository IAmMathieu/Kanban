-- commit en SQL, on démarre une série d'instructions, s'il y a le moindre souci on rollback
BEGIN;

-- si les tables existent, on les supprime
-- on se garantie de tout remettre à zéro
DROP TABLE IF EXISTS "list", "card", "tag", "card_has_tag";


CREATE TABLE IF NOT EXISTS "list" (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(255) NOT NULL DEFAULT '',
    "position" integer NOT NULL DEFAULT 0,
    -- "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" timestamptz NOT NULL DEFAULT NOW(),
    "updated_at" timestamptz
);

CREATE TABLE IF NOT EXISTS "card" (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" varchar(255) NOT NULL DEFAULT '',
    "position" integer NOT NULL DEFAULT 0,
    "color" varchar(25) NOT NULL DEFAULT '#FFFFFF',
    -- quand on supprime une liste, on veut supprimer les cartes qui sont affectées à cette liste
    -- on précise ON DELETE CASCADE pour faire cette suppression
    "list_id" integer NOT NULL REFERENCES list("id") ON DELETE CASCADE,
    "created_at" timestamptz NOT NULL DEFAULT NOW(),
    "updated_at" timestamptz
);

CREATE TABLE IF NOT EXISTS "tag" (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(255) NOT NULL DEFAULT '',
    "created_at" timestamptz NOT NULL DEFAULT NOW(),
    "updated_at" timestamptz
);

CREATE TABLE IF NOT EXISTS "card_has_tag" (
    "card_id" integer REFERENCES card("id") ON DELETE CASCADE,
    "tag_id" integer REFERENCES tag("id") ON DELETE CASCADE,
    "created_at" timestamptz NOT NULL DEFAULT NOW(),
    "updated_at" timestamptz
);

-- SEEDING
INSERT INTO "list" ("name", "position") VALUES
('Atome Blue', 1), ('Atome Red', 2);

INSERT INTO "card" ("title", "position", "color", "list_id") VALUES
('Pikachu', 1, 'Jaune', 1),
('Salamèche', 2, 'Rouge', 2),
('Bulbizarre', 3, 'Vert', 2);

INSERT INTO "tag" ("name") VALUES
('Poison'),
('Electricité'),
('Feu'),
('Sol');

INSERT INTO "card_has_tag" ("card_id", "tag_id") VALUES
(1, 2),
(2, 3),
(2, 1);

COMMIT;