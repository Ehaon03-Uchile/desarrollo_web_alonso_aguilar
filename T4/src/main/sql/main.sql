-- Active: 1757859900274@@127.0.0.1@3306@tarea2
-- 1) Regiones 
INSERT INTO region (nombre) VALUES ('Región Metropolitana') ON DUPLICATE KEY UPDATE nombre = nombre;
INSERT INTO region (nombre) VALUES ('Región de Valparaíso') ON DUPLICATE KEY UPDATE nombre = nombre;

-- 2) Comunas
INSERT INTO comuna (nombre, region_id) VALUES ('Santiago', 1);
INSERT INTO comuna (nombre, region_id) VALUES ('Viña del Mar', 2);

-- 3) Avisos 
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-01 09:00:00', 1, 'Centro', 'Miní', 'minini@example.test', '+56911111111', 'gato', 1, 2, 'a', '2025-11-05 00:00:00', 'Gatito juguetón y castrado.'),
  ('2025-11-02 14:30:00', 2, 'Playa', 'Firulais', 'firulais@example.test', '+56922222222', 'perro', 2, 1, 'a', '2025-11-10 00:00:00', 'Perros sociables y juguetones.');

-------------------- Inyección de datos falsos (para completar la BDD) -------------------

-- 1) Añadir más regiones si no existen
INSERT INTO region (nombre)
SELECT * FROM (SELECT 'Región de O´Higgins' AS nombre) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM region WHERE nombre = 'Región de O''Higgins');

INSERT INTO region (nombre)
SELECT * FROM (SELECT 'Región de Coquimbo' AS nombre) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM region WHERE nombre = 'Región de Coquimbo');

-- 2) Añadir comunas vinculadas a regiones (busca el id por nombre de región)
INSERT INTO comuna (nombre, region_id)
SELECT * FROM (
  SELECT 'Rancagua' AS nombre, (SELECT id FROM region WHERE nombre = 'Región de O´Higgins' LIMIT 1) AS region_id
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM comuna WHERE nombre = 'Rancagua' AND region_id = tmp.region_id);

INSERT INTO comuna (nombre, region_id)
SELECT * FROM (
  SELECT 'La Serena' AS nombre, (SELECT id FROM region WHERE nombre = 'Región de Coquimbo' LIMIT 1) AS region_id
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM comuna WHERE nombre = 'La Serena' AND region_id = tmp.region_id);

-- 3) Insertar varios avisos (algunos en comunas ya existentes)
-- NOTA: usamos subconsultas para obtener comuna_id por nombre.
-- Aviso A: sin notas
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-05 08:00:00',
   (SELECT id FROM comuna WHERE nombre = 'Rancagua' LIMIT 1),
   'Bosque',
   'Luna',
   'luna@example.test',
   '+56930000001',
   'gato',
   1,
   3,
   'a',
   '2025-11-15 00:00:00',
   'Gata tímida, necesita paciencia.'
  );

-- Aviso B: 1 nota
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-06 10:30:00',
   (SELECT id FROM comuna WHERE nombre = 'La Serena' LIMIT 1),
   'Centro',
   'Tito',
   'tito@example.test',
   '+56930000002',
   'perro',
   1,
   1,
   'a',
   '2025-11-20 00:00:00',
   'Perro activo, ideal para familia con patio.'
  );

-- Insertar 1 nota para Tito (Aviso B)
INSERT INTO nota (aviso_id, nota)
VALUES (
  (SELECT id FROM aviso_adopcion WHERE nombre = 'Tito' AND fecha_ingreso = '2025-11-06 10:30:00' LIMIT 1),
  6
);

-- Aviso C: múltiples notas (3 notas)
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-07 12:00:00',
   (SELECT id FROM comuna WHERE nombre = 'Santiago' LIMIT 1),
   'Norte',
   'Mango',
   'mango@example.test',
   '+56930000003',
   'gato',
   2,
   6,
   'm',
   '2025-11-25 00:00:00',
   'Pareja de gatitos, cariñosos.'
  );

-- Notas para Mango (3 notas)
INSERT INTO nota (aviso_id, nota)
VALUES (
  (SELECT id FROM aviso_adopcion WHERE nombre = 'Mango' AND fecha_ingreso = '2025-11-07 12:00:00' LIMIT 1),
  5
), (
  (SELECT id FROM aviso_adopcion WHERE nombre = 'Mango' AND fecha_ingreso = '2025-11-07 12:00:00' LIMIT 1),
  4
), (
  (SELECT id FROM aviso_adopcion WHERE nombre = 'Mango' AND fecha_ingreso = '2025-11-07 12:00:00' LIMIT 1),
  6
);

-- Aviso D: sin notas
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-08 09:45:00',
   (SELECT id FROM comuna WHERE nombre = 'Viña del Mar' LIMIT 1),
   'Quinta',
   'Nico',
   'nico@example.test',
   '+56930000004',
   'perro',
   1,
   4,
   'a',
   '2025-11-30 00:00:00',
   'Perro tranquilo, buen compañero.'
  );

-- Aviso E: 1 nota
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-09 16:10:00',
   (SELECT id FROM comuna WHERE nombre = 'Santiago' LIMIT 1),
   'Sur',
   'Fresca',
   'fresca@example.test',
   '+56930000005',
   'gato',
   1,
   8,
   'm',
   '2025-12-01 00:00:00',
   'Gata buena con niños.'
  );

INSERT INTO nota (aviso_id, nota)
VALUES (
  (SELECT id FROM aviso_adopcion WHERE nombre = 'Fresca' AND fecha_ingreso = '2025-11-09 16:10:00' LIMIT 1),
  7
);

-- Aviso F: múltiples notas (2 notas)
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-10 11:20:00',
   (SELECT id FROM comuna WHERE nombre = 'La Serena' LIMIT 1),
   'Altamar',
   'Rayo',
   'rayo@example.test',
   '+56930000006',
   'perro',
   1,
   2,
   'a',
   '2025-11-20 00:00:00',
   'Cachorro enérgico.'
  );

INSERT INTO nota (aviso_id, nota)
VALUES (
  (SELECT id FROM aviso_adopcion WHERE nombre = 'Rayo' AND fecha_ingreso = '2025-11-10 11:20:00' LIMIT 1),
  4
), (
  (SELECT id FROM aviso_adopcion WHERE nombre = 'Rayo' AND fecha_ingreso = '2025-11-10 11:20:00' LIMIT 1),
  5
);

-- Aviso G: sin notas
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-11 08:30:00',
   (SELECT id FROM comuna WHERE nombre = 'Rancagua' LIMIT 1),
   'Zonacentral',
   'Kira',
   'kira@example.test',
   '+56930000007',
   'gato',
   1,
   12,
   'm',
   '2025-12-05 00:00:00',
   'Gata mayor, tranquila y cariñosa.'
  );

-- Aviso H: 1 nota
INSERT INTO aviso_adopcion
  (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
VALUES
  ('2025-11-12 13:40:00',
   (SELECT id FROM comuna WHERE nombre = 'Viña del Mar' LIMIT 1),
   'Valle',
   'Oso',
   'oso@example.test',
   '+56930000008',
   'perro',
   1,
   5,
   'a',
   '2025-12-10 00:00:00',
   'Perro grande pero manso.'
  );

INSERT INTO nota (aviso_id, nota)
VALUES (
  (SELECT id FROM aviso_adopcion WHERE nombre = 'Oso' AND fecha_ingreso = '2025-11-12 13:40:00' LIMIT 1),
  6
);


