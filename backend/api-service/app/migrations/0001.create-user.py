"""
CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_admin BOOL NOT NULL,
            is_delete BOOL NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        )

CREATE TABLE features (
            id SERIAL PRIMARY KEY,
            prompt VARCHAR(255) NOT NULL,
            height INT NOT NULL,
            width INT NOT NULL,
            goal VARCHAR(255) ,
            colour VARCHAR(255) NOT NULL,
            product VARCHAR(255),
            holiday VARCHAR(255),
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
            id INT PRIMARY KEY,
            child_s3_url TEXT NOT NULL,
            parent_s3_url TEXT NOT NULL,
            x INT NOT NULL,
            y INT NOT NULL,
            child_w INT NOT NULL,
            child_h INT NOT NULL,
            colour VARCHAR(255) NOT NULL,
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
    step("CREATE TABLE users ( id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, is_admin  BOOL NOT NULL, is_delete BOOL NOT NULL, created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP)",
        "DROP TABLE users"),

    step(f"INSERT INTO users (name, password, email, is_admin, is_delete) VALUES ('admin', '{get_password_hash('admin')}', 'admin@admin.com', true, false);"),

    step(f"INSERT INTO users (name, password, email, is_admin, is_delete) VALUES ('test', '{get_password_hash('test')}', 'test@test.com', false, false);"),

    
    step("CREATE TABLE features ( id SERIAL PRIMARY KEY, prompt VARCHAR(255), height INT NOT NULL, width INT NOT NULL, goal VARCHAR(255), colour VARCHAR(255) NOT NULL, product VARCHAR(255),holiday VARCHAR(255), image_type VARCHAR(255) NOT NULL, tags VARCHAR(255))",
        "DROP TABLE features"),
    
    
    step(" CREATE TABLE requests ( id SERIAL PRIMARY KEY, created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, status VARCHAR(255) NOT NULL, fk_features INT, fk_user INT, FOREIGN KEY (fk_features) REFERENCES features(id), FOREIGN KEY (fk_user) REFERENCES users(id) )",
        "DROP TABLE requests"),
    
    
    step("CREATE TABLE response ( id SERIAL PRIMARY KEY, child_s3_url TEXT NOT NULL, parent_s3_url TEXT NOT NULL, x INT NOT NULL, y INT NOT NULL, child_w INT NOT NULL, child_h INT NOT NULL, colour VARCHAR(255) NOT NULL, fk_request INT, rating INT, fk_user INT, FOREIGN KEY (fk_request) REFERENCES requests(id), FOREIGN KEY (fk_user) REFERENCES users(id))",
        "DROP TABLE response")
]
