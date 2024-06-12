"""
CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_admin BOOL NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        )

CREATE TABLE features (
            id SERIAL PRIMARY KEY,
            prompt VARCHAR(255) NOT NULL,
            height INT NOT NULL,
            widht INT NOT NULL,
            goal VARCHAR(255) NOT NULL,
            colour VARCHAR(255) NOT NULL,
            product VARCHAR(255) NOT NULL,
            image_type VARCHAR(255) NOT NULL,
            tags VARCHAR(255)
        )


CREATE TABLE requests (
            id SERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(255) NOT NULL,
            fk_features INT,
            fk_user INT,
            FOREIGN KEY (fk_features) REFERENCES features(id),
            FOREIGN KEY (fk_user) REFERENCES users(id)
        )

CREATE TABLE response (
            id SERIAL PRIMARY KEY,
            s3_url TEXT NOT NULL,
            rating INT, 
            fk_request INT,
            fk_user INT,
            FOREIGN KEY (fk_request) REFERENCES requests(id),
            FOREIGN KEY (fk_user) REFERENCES users(id)
        )
"""

from yoyo import step

from utils.jwt import get_password_hash

__depends__ = {}

steps = [
    step("CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, is_admin  BOOL NOT NULL, created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP)",
        "DROP TABLE users"),

    step(f"INSERT INTO users (name, password, email, is_admin) VALUES ('admin', '{get_password_hash('admin')}', 'admin@admin.com', true);"),

    step(f"INSERT INTO users (name, password, email, is_admin) VALUES ('test', '{get_password_hash('test')}', 'test@test.com', false);"),

    
    step("CREATE TABLE features ( id SERIAL PRIMARY KEY, prompt VARCHAR(255) NOT NULL, height INT NOT NULL, widht INT NOT NULL, goal VARCHAR(255) NOT NULL,colour VARCHAR(255) NOT NULL, product VARCHAR(255) NOT NULL, image_type VARCHAR(255) NOT NULL, tags VARCHAR(255))",
        "DROP TABLE features"),
    
    
    step(" CREATE TABLE requests ( id SERIAL PRIMARY KEY, created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, status VARCHAR(255) NOT NULL, fk_features INT, fk_user INT, FOREIGN KEY (fk_features) REFERENCES features(id), FOREIGN KEY (fk_user) REFERENCES users(id) )",
        "DROP TABLE requests"),
    
    
    step("CREATE TABLE response ( id SERIAL PRIMARY KEY, s3_url text NOT NULL, fk_request INT, rating INT, fk_user INT, FOREIGN KEY (fk_request) REFERENCES requests(id), FOREIGN KEY (fk_user) REFERENCES users(id))",
        "DROP TABLE response")
]
