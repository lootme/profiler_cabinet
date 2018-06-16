-- Adminer 4.6.2 PostgreSQL dump

DROP TABLE IF EXISTS "Measures";
DROP SEQUENCE IF EXISTS "Measures_id_seq";
CREATE SEQUENCE "Measures_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."Measures" (
    "id" integer DEFAULT nextval('"Measures_id_seq"') NOT NULL,
    "name" character varying(255),
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "ProjectId" integer,
    CONSTRAINT "Measures_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Measures_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Projects"(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "Measures" ("id", "name", "createdAt", "updatedAt", "ProjectId") VALUES
(1,	'My first measure',	'2018-06-16 20:01:23.921+00',	'2018-06-16 20:01:23.921+00',	1);

DROP TABLE IF EXISTS "PointTypes";
DROP SEQUENCE IF EXISTS "PointTypes_id_seq";
CREATE SEQUENCE "PointTypes_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."PointTypes" (
    "id" integer DEFAULT nextval('"PointTypes_id_seq"') NOT NULL,
    "name" character varying(255),
    "unit" character varying(255),
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT "PointTypes_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "PointTypes" ("id", "name", "unit", "createdAt", "updatedAt") VALUES
(1,	'Memory usage',	'bytes',	'2018-06-16 19:24:15.995278+00',	'2018-06-16 19:24:15.995278+00'),
(2,	'Time usage',	'sec',	'2018-06-16 19:24:46.759332+00',	'2018-06-16 19:24:46.759332+00');

DROP TABLE IF EXISTS "Points";
DROP SEQUENCE IF EXISTS "Points_id_seq";
CREATE SEQUENCE "Points_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."Points" (
    "id" integer DEFAULT nextval('"Points_id_seq"') NOT NULL,
    "value" character varying(255),
    "trace" json,
    "comment" character varying(255),
    "datetime" timestamptz,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "MeasureId" integer,
    "PointTypeId" integer,
    CONSTRAINT "Points_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Points_MeasureId_fkey" FOREIGN KEY ("MeasureId") REFERENCES "Measures"(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE,
    CONSTRAINT "Points_PointTypeId_fkey" FOREIGN KEY ("PointTypeId") REFERENCES "PointTypes"(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "Points" ("id", "value", "trace", "comment", "datetime", "createdAt", "updatedAt", "MeasureId", "PointTypeId") VALUES
(1,	'2.3',	'"{testTrace:1}"',	'testcomment',	'2018-06-16 23:01:23+00',	'2018-06-16 20:01:23.955+00',	'2018-06-16 20:01:23.955+00',	NULL,	1),
(2,	'2.3',	'"{testTrace:1}"',	'testcomment',	'2018-06-16 23:02:05+00',	'2018-06-16 20:02:05.999+00',	'2018-06-16 20:02:05.999+00',	NULL,	1),
(3,	'2.3',	'"{testTrace:1}"',	'testcomment',	'2018-06-16 23:08:02+00',	'2018-06-16 20:08:03.279+00',	'2018-06-16 20:08:03.279+00',	NULL,	1),
(4,	'2.3',	'"{testTrace:1}"',	'testcomment',	'2018-06-16 23:09:49+00',	'2018-06-16 20:09:54.185+00',	'2018-06-16 20:09:54.185+00',	1,	1);

DROP TABLE IF EXISTS "Projects";
DROP SEQUENCE IF EXISTS "Projects_id_seq";
CREATE SEQUENCE "Projects_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."Projects" (
    "id" integer DEFAULT nextval('"Projects_id_seq"') NOT NULL,
    "name" character varying(255),
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "UserId" integer,
    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Projects_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "Projects" ("id", "name", "createdAt", "updatedAt", "UserId") VALUES
(1,	'Buckshee',	'2018-06-12 22:08:55.209+00',	'2018-06-12 22:08:55.209+00',	2),
(2,	'Beatheaven',	'2018-06-12 22:09:22.754+00',	'2018-06-12 22:09:22.754+00',	2),
(3,	'Boochi.ru',	'2018-06-12 22:11:39.408+00',	'2018-06-12 22:11:39.408+00',	1);

DROP TABLE IF EXISTS "UserRoleActions";
DROP SEQUENCE IF EXISTS "UserRoleActions_id_seq";
CREATE SEQUENCE "UserRoleActions_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."UserRoleActions" (
    "id" integer DEFAULT nextval('"UserRoleActions_id_seq"') NOT NULL,
    "name" character varying(255) NOT NULL,
    "code" character varying(255) NOT NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT "UserRoleActions_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "UserRoleActions" ("id", "name", "code", "createdAt", "updatedAt") VALUES
(30,	'Add points',	'POINTS_ADD',	'2018-06-14 21:53:15.585+00',	'2018-06-14 21:53:15.585+00'),
(31,	'Add own points',	'POINTS_ADD_OWN',	'2018-06-14 21:53:22.934+00',	'2018-06-14 21:53:22.934+00'),
(32,	'Update own points',	'POINTS_UPDATE_OWN',	'2018-06-14 21:53:40.554+00',	'2018-06-14 21:53:40.554+00'),
(33,	'View own points',	'POINTS_VIEW_OWN',	'2018-06-14 21:53:59.312+00',	'2018-06-14 21:53:59.312+00'),
(34,	'Delete own points',	'POINTS_DEL_OWN',	'2018-06-14 21:54:33.829+00',	'2018-06-14 21:54:33.829+00'),
(35,	'Delete points',	'POINTS_DEL',	'2018-06-14 21:54:39.953+00',	'2018-06-14 21:54:39.953+00'),
(36,	'View points',	'POINTS_VIEW',	'2018-06-14 21:54:47.186+00',	'2018-06-14 21:54:47.186+00'),
(37,	'Update points',	'POINTS_UPDATE',	'2018-06-14 21:55:37.593+00',	'2018-06-14 21:55:37.593+00'),
(38,	'Update point types',	'POINT_TYPES_UPDATE',	'2018-06-14 21:55:52.642+00',	'2018-06-14 21:55:52.642+00'),
(39,	'View point types',	'POINT_TYPES_VIEW',	'2018-06-14 21:55:59.259+00',	'2018-06-14 21:55:59.259+00'),
(40,	'Delete point types',	'POINT_TYPES_DEL',	'2018-06-14 21:56:07.266+00',	'2018-06-14 21:56:07.266+00'),
(41,	'Add point types',	'POINT_TYPES_ADD',	'2018-06-14 21:56:12.276+00',	'2018-06-14 21:56:12.276+00'),
(42,	'Add own point types',	'POINT_TYPES_ADD_OWN',	'2018-06-14 21:56:20.165+00',	'2018-06-14 21:56:20.165+00'),
(43,	'Update own point types',	'POINT_TYPES_UPDATE_OWN',	'2018-06-14 21:56:28.411+00',	'2018-06-14 21:56:28.411+00'),
(44,	'View own point types',	'POINT_TYPES_VIEW_OWN',	'2018-06-14 21:56:35.949+00',	'2018-06-14 21:56:35.949+00'),
(45,	'Delete own point types',	'POINT_TYPES_DEL_OWN',	'2018-06-14 21:57:22.464+00',	'2018-06-14 21:57:22.464+00'),
(1,	'View users',	'USERS_VIEW',	'2018-06-12 21:08:33.581+00',	'2018-06-12 21:08:33.581+00'),
(2,	'Add users',	'USERS_ADD',	'2018-06-12 21:08:47.084+00',	'2018-06-12 21:08:47.084+00'),
(3,	'Delete users',	'USERS_DEL',	'2018-06-12 21:08:55.72+00',	'2018-06-12 21:08:55.72+00'),
(4,	'Update users',	'USERS_UPDATE',	'2018-06-12 21:09:04.733+00',	'2018-06-12 21:09:04.733+00'),
(6,	'View user roles',	'USER_ROLES_VIEW',	'2018-06-12 21:09:43.619+00',	'2018-06-12 21:09:43.619+00'),
(7,	'Add user roles',	'USER_ROLES_ADD',	'2018-06-12 21:09:48.924+00',	'2018-06-12 21:09:48.924+00'),
(8,	'Delete user roles',	'USER_ROLES_DEL',	'2018-06-12 21:09:55.897+00',	'2018-06-12 21:09:55.897+00'),
(9,	'Update user roles',	'USER_ROLES_UPDATE',	'2018-06-12 21:10:20.338+00',	'2018-06-12 21:10:20.338+00'),
(10,	'View user role actions',	'USER_ROLE_ACTIONS_VIEW',	'2018-06-12 21:10:44.667+00',	'2018-06-12 21:10:44.667+00'),
(11,	'Add user role actions',	'USER_ROLE_ACTIONS_ADD',	'2018-06-12 21:10:50.262+00',	'2018-06-12 21:10:50.262+00'),
(12,	'Update user role actions',	'USER_ROLE_ACTIONS_UPDATE',	'2018-06-12 21:10:58.495+00',	'2018-06-12 21:10:58.495+00'),
(13,	'Delete user role actions',	'USER_ROLE_ACTIONS_DEL',	'2018-06-12 21:11:05.19+00',	'2018-06-12 21:11:05.19+00'),
(14,	'View projects',	'PROJECTS_VIEW',	'2018-06-12 21:11:18.069+00',	'2018-06-12 21:11:18.069+00'),
(15,	'View own projects',	'PROJECTS_VIEW_OWN',	'2018-06-12 21:11:26.006+00',	'2018-06-12 21:11:26.006+00'),
(16,	'Add projects',	'PROJECTS_ADD',	'2018-06-12 21:11:34.138+00',	'2018-06-12 21:11:34.138+00'),
(17,	'Add own projects',	'PROJECTS_ADD_OWN',	'2018-06-12 21:11:41+00',	'2018-06-12 21:15:18.879+00'),
(18,	'Enter Cabinet Site Section',	'ENTER_CABINET',	'2018-06-12 21:23:51+00',	'2018-06-12 21:25:02.791+00'),
(19,	'View measures',	'MEASURES_VIEW',	'2018-06-12 21:27:51.713+00',	'2018-06-12 21:27:51.713+00'),
(20,	'View own measures',	'MEASURES_VIEW_OWN',	'2018-06-12 21:27:58.108+00',	'2018-06-12 21:27:58.108+00'),
(21,	'Add measures',	'MEASURES_ADD',	'2018-06-12 21:28:06.739+00',	'2018-06-12 21:28:06.739+00'),
(22,	'Add own measures',	'MEASURES_ADD_OWN',	'2018-06-12 21:28:13.96+00',	'2018-06-12 21:28:13.96+00'),
(23,	'Delete measures',	'MEASURES_DELETE',	'2018-06-12 21:28:26.139+00',	'2018-06-12 21:28:26.139+00'),
(24,	'Delete own measures',	'MEASURES_DELETE_OWN',	'2018-06-12 21:28:30.134+00',	'2018-06-12 21:28:30.134+00'),
(25,	'Update own measures',	'MEASURES_UPDATE_OWN',	'2018-06-12 21:28:40.575+00',	'2018-06-12 21:28:40.575+00'),
(26,	'Update measures',	'MEASURES_UPDATE',	'2018-06-12 21:28:43.853+00',	'2018-06-12 21:28:43.853+00');

DROP TABLE IF EXISTS "UserRoles";
DROP SEQUENCE IF EXISTS "UserRoles_id_seq";
CREATE SEQUENCE "UserRoles_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."UserRoles" (
    "id" integer DEFAULT nextval('"UserRoles_id_seq"') NOT NULL,
    "name" character varying(255) NOT NULL,
    "priority" "enum_UserRoles_priority" NOT NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "UserRoles" ("id", "name", "priority", "createdAt", "updatedAt") VALUES
(11,	'Client',	'1',	'2018-06-12 21:12:00+00',	'2018-06-12 21:29:30.377+00'),
(10,	'Administrator',	'1',	'2018-06-12 21:12:00+00',	'2018-06-14 21:58:06.073+00');

DROP TABLE IF EXISTS "UserRolesUserRoleActions";
CREATE TABLE "public"."UserRolesUserRoleActions" (
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "UserRoleId" integer NOT NULL,
    "UserRoleActionId" integer NOT NULL,
    CONSTRAINT "UserRolesUserRoleActions_pkey" PRIMARY KEY ("UserRoleId", "UserRoleActionId"),
    CONSTRAINT "UserRolesUserRoleActions_UserRoleActionId_fkey" FOREIGN KEY ("UserRoleActionId") REFERENCES "UserRoleActions"(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "UserRolesUserRoleActions_UserRoleId_fkey" FOREIGN KEY ("UserRoleId") REFERENCES "UserRoles"(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "UserRolesUserRoleActions" ("createdAt", "updatedAt", "UserRoleId", "UserRoleActionId") VALUES
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	18),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	15),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	16),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	17),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	1),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	2),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	3),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	4),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	6),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	7),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	8),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	9),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	10),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	11),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	12),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	13),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	14),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	19),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	20),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	21),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	22),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	24),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	23),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	25),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	26),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	30),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	33),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	31),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	36),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	34),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	32),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	35),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	38),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	40),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	42),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	37),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	39),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	41),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	43),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	45),
('2018-06-14 21:58:06.146+00',	'2018-06-14 21:58:06.146+00',	10,	44),
('2018-06-12 21:29:30.408+00',	'2018-06-12 21:29:30.408+00',	11,	17),
('2018-06-12 21:29:30.408+00',	'2018-06-12 21:29:30.408+00',	11,	18),
('2018-06-12 21:29:30.408+00',	'2018-06-12 21:29:30.408+00',	11,	15),
('2018-06-12 21:29:30.408+00',	'2018-06-12 21:29:30.408+00',	11,	20),
('2018-06-12 21:29:30.408+00',	'2018-06-12 21:29:30.408+00',	11,	22),
('2018-06-12 21:29:30.408+00',	'2018-06-12 21:29:30.408+00',	11,	24),
('2018-06-12 21:29:30.408+00',	'2018-06-12 21:29:30.408+00',	11,	25);

DROP TABLE IF EXISTS "UserUserRoles";
CREATE TABLE "public"."UserUserRoles" (
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "UserId" integer NOT NULL,
    "UserRoleId" integer NOT NULL,
    CONSTRAINT "UserUserRoles_pkey" PRIMARY KEY ("UserId", "UserRoleId"),
    CONSTRAINT "UserUserRoles_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE,
    CONSTRAINT "UserUserRoles_UserRoleId_fkey" FOREIGN KEY ("UserRoleId") REFERENCES "UserRoles"(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE
) WITH (oids = false);

INSERT INTO "UserUserRoles" ("createdAt", "updatedAt", "UserId", "UserRoleId") VALUES
('2018-06-12 21:14:21.079089+00',	'2018-06-12 21:14:21.079089+00',	2,	10),
('2018-06-12 21:24:12.476+00',	'2018-06-12 21:24:12.476+00',	1,	11);

DROP TABLE IF EXISTS "Users";
DROP SEQUENCE IF EXISTS "Users_id_seq";
CREATE SEQUENCE "Users_id_seq" INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "public"."Users" (
    "id" integer DEFAULT nextval('"Users_id_seq"') NOT NULL,
    "username" character varying(255) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "name" character varying(255),
    "last_name" character varying(255),
    "api_key" character varying(255),
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "Users" ("id", "username", "password_hash", "name", "last_name", "api_key", "createdAt", "updatedAt") VALUES
(2,	'lootme',	'$2a$10$7YOqlYXJSbYMDITnBWcROON3BVbwHw/0upYbfNuYRoOVvKq6zNOA.',	'lootme',	'lootme',	'4297f44b13955235245b2497399d7a93',	'2018-06-12 21:06:14.155851+00',	'2018-06-12 21:06:14.155851+00'),
(1,	'john',	'$2a$10$7YOqlYXJSbYMDITnBWcROON3BVbwHw/0upYbfNuYRoOVvKq6zNOA.',	'john',	'black',	'eJnWy91Z4YXLVyRtz9WH',	'2018-06-12 21:03:00+00',	'2018-06-12 21:24:12.446+00');

-- 2018-06-16 20:50:05.447869+00
