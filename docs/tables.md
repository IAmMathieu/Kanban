Liste(_id_, nom, position, created_at, updated_at)
Carte(_id_, titre, position, couleur, created_at, updated_at, #list_id)
Tag(_id_, nom, created_at, updated_at)
Caractèriser(#carte_id, #tag_id, created_at, updated_at)