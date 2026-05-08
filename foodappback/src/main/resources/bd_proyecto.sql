/* =====================================================
   ELIMINAR BD SI EXISTE, CREAR BD Y USARLA
   ===================================================== */
DROP DATABASE IF EXISTS MiProyecto;
CREATE DATABASE MiProyecto;
USE MiProyecto;


/* =====================================================
   TABLA: roles
   ===================================================== */
CREATE TABLE Roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uk_roles_name UNIQUE (name)
);

/* =====================================================
   TABLA: users
   ===================================================== */
CREATE TABLE Users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    username VARCHAR(12) NOT NULL,
    password VARCHAR(80) NOT NULL,
    email VARCHAR(30) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email UNIQUE (email)
);

/* =====================================================
   TABLA INTERMEDIA: users_roles
   ===================================================== */
CREATE TABLE Users_Roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    CONSTRAINT pk_users_roles PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_users_roles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_users_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/* =====================================================
   TABLA: products
   ===================================================== */
CREATE TABLE Products (
    id BIGINT NOT NULL AUTO_INCREMENT,
    barcode VARCHAR(20),
    name VARCHAR(40) NOT NULL,
    brand VARCHAR(20),
    cantidad INT DEFAULT 1,
    url_image TEXT,
    user_id BIGINT NOT NULL,
    CONSTRAINT uk_products_barcode UNIQUE (barcode),
    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(id)
    
);



/* =====================================================
   DATOS INICIALES (OPCIONAL)
   ===================================================== */
/* Roles */
INSERT INTO Roles (name) VALUES
('ROLE_USER'),
('ROLE_ADMIN');

/* Insertar usuario admin */
INSERT INTO Users (name, lastname,username, password, email, enabled)
VALUES ('admin', 'Admin', 'admin', 'admin', 'admin@admin.com', TRUE); 

/* Asignar rol ADMIN al usuario admin */
INSERT INTO users_roles (user_id, role_id)
VALUES (1, 2);

/* Productos de ejemplo */
INSERT INTO Products (name,  brand, cantidad, user_id)
VALUES 
('Tomate frito', 'Orlando', 2, 1),
('Leche entera', 'Mercadona', 1, 1),
('Patatas', '', 5, 1);
