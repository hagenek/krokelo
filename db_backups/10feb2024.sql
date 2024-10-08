toc.dat                                                                                             0000600 0004000 0002000 00000061201 14561673262 0014453 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP               
        |            railway    16.0 (Debian 16.0-1.pgdg120+1)    16.0 R    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         �           1262    16384    railway    DATABASE     r   CREATE DATABASE railway WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE railway;
                postgres    false                     2615    17281    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false         �           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    5         �           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5         �            1259    17310    ELOLog    TABLE     �   CREATE TABLE public."ELOLog" (
    id integer NOT NULL,
    "playerId" integer NOT NULL,
    elo integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "matchId" integer NOT NULL
);
    DROP TABLE public."ELOLog";
       public         heap    postgres    false    5         �            1259    17309    ELOLog_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ELOLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."ELOLog_id_seq";
       public          postgres    false    5    221         �           0    0    ELOLog_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."ELOLog_id_seq" OWNED BY public."ELOLog".id;
          public          postgres    false    220         �            1259    17302    Match    TABLE     7  CREATE TABLE public."Match" (
    id integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "winnerId" integer NOT NULL,
    "loserId" integer NOT NULL,
    "winnerELO" integer NOT NULL,
    "loserELO" integer NOT NULL,
    "playerId" integer,
    "matchType" text
);
    DROP TABLE public."Match";
       public         heap    postgres    false    5         �            1259    17301    Match_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Match_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Match_id_seq";
       public          postgres    false    5    219         �           0    0    Match_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Match_id_seq" OWNED BY public."Match".id;
          public          postgres    false    218         �            1259    17292    Player    TABLE     �   CREATE TABLE public."Player" (
    id integer NOT NULL,
    name text NOT NULL,
    "currentELO" integer DEFAULT 1500 NOT NULL,
    "currentTeamELO" integer DEFAULT 1500 NOT NULL,
    "previousELO" integer,
    "previousTeamELO" integer
);
    DROP TABLE public."Player";
       public         heap    postgres    false    5         �            1259    17291    Player_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Player_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Player_id_seq";
       public          postgres    false    5    217         �           0    0    Player_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Player_id_seq" OWNED BY public."Player".id;
          public          postgres    false    216         �            1259    17344    Team    TABLE     �   CREATE TABLE public."Team" (
    id integer NOT NULL,
    "currentELO" integer DEFAULT 1500 NOT NULL,
    "previousELO" integer
);
    DROP TABLE public."Team";
       public         heap    postgres    false    5         �            1259    17412 
   TeamELOLog    TABLE     �   CREATE TABLE public."TeamELOLog" (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    elo integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "teamMatchId" integer NOT NULL
);
     DROP TABLE public."TeamELOLog";
       public         heap    postgres    false    5         �            1259    17411    TeamELOLog_id_seq    SEQUENCE     �   CREATE SEQUENCE public."TeamELOLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."TeamELOLog_id_seq";
       public          postgres    false    230    5         �           0    0    TeamELOLog_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."TeamELOLog_id_seq" OWNED BY public."TeamELOLog".id;
          public          postgres    false    229         �            1259    17351 	   TeamMatch    TABLE       CREATE TABLE public."TeamMatch" (
    id integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "winnerTeamId" integer NOT NULL,
    "loserTeamId" integer NOT NULL,
    "winnerELO" integer NOT NULL,
    "loserELO" integer NOT NULL
);
    DROP TABLE public."TeamMatch";
       public         heap    postgres    false    5         �            1259    17350    TeamMatch_id_seq    SEQUENCE     �   CREATE SEQUENCE public."TeamMatch_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."TeamMatch_id_seq";
       public          postgres    false    225    5         �           0    0    TeamMatch_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."TeamMatch_id_seq" OWNED BY public."TeamMatch".id;
          public          postgres    false    224         �            1259    17404    TeamPlayerELOLog    TABLE     �   CREATE TABLE public."TeamPlayerELOLog" (
    id integer NOT NULL,
    "playerId" integer NOT NULL,
    elo integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "teamMatchId" integer NOT NULL
);
 &   DROP TABLE public."TeamPlayerELOLog";
       public         heap    postgres    false    5         �            1259    17403    TeamPlayerELOLog_id_seq    SEQUENCE     �   CREATE SEQUENCE public."TeamPlayerELOLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public."TeamPlayerELOLog_id_seq";
       public          postgres    false    5    228         �           0    0    TeamPlayerELOLog_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public."TeamPlayerELOLog_id_seq" OWNED BY public."TeamPlayerELOLog".id;
          public          postgres    false    227         �            1259    17343    Team_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Team_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."Team_id_seq";
       public          postgres    false    223    5         �           0    0    Team_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."Team_id_seq" OWNED BY public."Team".id;
          public          postgres    false    222         �            1259    17358    _TeamMembers    TABLE     [   CREATE TABLE public."_TeamMembers" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 "   DROP TABLE public."_TeamMembers";
       public         heap    postgres    false    5         �            1259    17282    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    5         �           2604    17313 	   ELOLog id    DEFAULT     j   ALTER TABLE ONLY public."ELOLog" ALTER COLUMN id SET DEFAULT nextval('public."ELOLog_id_seq"'::regclass);
 :   ALTER TABLE public."ELOLog" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221         �           2604    17305    Match id    DEFAULT     h   ALTER TABLE ONLY public."Match" ALTER COLUMN id SET DEFAULT nextval('public."Match_id_seq"'::regclass);
 9   ALTER TABLE public."Match" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219         �           2604    17295 	   Player id    DEFAULT     j   ALTER TABLE ONLY public."Player" ALTER COLUMN id SET DEFAULT nextval('public."Player_id_seq"'::regclass);
 :   ALTER TABLE public."Player" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217         �           2604    17347    Team id    DEFAULT     f   ALTER TABLE ONLY public."Team" ALTER COLUMN id SET DEFAULT nextval('public."Team_id_seq"'::regclass);
 8   ALTER TABLE public."Team" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223         �           2604    17415    TeamELOLog id    DEFAULT     r   ALTER TABLE ONLY public."TeamELOLog" ALTER COLUMN id SET DEFAULT nextval('public."TeamELOLog_id_seq"'::regclass);
 >   ALTER TABLE public."TeamELOLog" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229    230         �           2604    17354    TeamMatch id    DEFAULT     p   ALTER TABLE ONLY public."TeamMatch" ALTER COLUMN id SET DEFAULT nextval('public."TeamMatch_id_seq"'::regclass);
 =   ALTER TABLE public."TeamMatch" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    225    225         �           2604    17407    TeamPlayerELOLog id    DEFAULT     ~   ALTER TABLE ONLY public."TeamPlayerELOLog" ALTER COLUMN id SET DEFAULT nextval('public."TeamPlayerELOLog_id_seq"'::regclass);
 D   ALTER TABLE public."TeamPlayerELOLog" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    227    228         t          0    17310    ELOLog 
   TABLE DATA           H   COPY public."ELOLog" (id, "playerId", elo, date, "matchId") FROM stdin;
    public          postgres    false    221       3444.dat r          0    17302    Match 
   TABLE DATA           t   COPY public."Match" (id, date, "winnerId", "loserId", "winnerELO", "loserELO", "playerId", "matchType") FROM stdin;
    public          postgres    false    219       3442.dat p          0    17292    Player 
   TABLE DATA           n   COPY public."Player" (id, name, "currentELO", "currentTeamELO", "previousELO", "previousTeamELO") FROM stdin;
    public          postgres    false    217       3440.dat v          0    17344    Team 
   TABLE DATA           A   COPY public."Team" (id, "currentELO", "previousELO") FROM stdin;
    public          postgres    false    223       3446.dat }          0    17412 
   TeamELOLog 
   TABLE DATA           N   COPY public."TeamELOLog" (id, "teamId", elo, date, "teamMatchId") FROM stdin;
    public          postgres    false    230       3453.dat x          0    17351 	   TeamMatch 
   TABLE DATA           g   COPY public."TeamMatch" (id, date, "winnerTeamId", "loserTeamId", "winnerELO", "loserELO") FROM stdin;
    public          postgres    false    225       3448.dat {          0    17404    TeamPlayerELOLog 
   TABLE DATA           V   COPY public."TeamPlayerELOLog" (id, "playerId", elo, date, "teamMatchId") FROM stdin;
    public          postgres    false    228       3451.dat y          0    17358    _TeamMembers 
   TABLE DATA           2   COPY public."_TeamMembers" ("A", "B") FROM stdin;
    public          postgres    false    226       3449.dat n          0    17282    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    215       3438.dat �           0    0    ELOLog_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."ELOLog_id_seq"', 294, true);
          public          postgres    false    220         �           0    0    Match_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Match_id_seq"', 147, true);
          public          postgres    false    218         �           0    0    Player_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Player_id_seq"', 25, true);
          public          postgres    false    216         �           0    0    TeamELOLog_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."TeamELOLog_id_seq"', 90, true);
          public          postgres    false    229         �           0    0    TeamMatch_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."TeamMatch_id_seq"', 45, true);
          public          postgres    false    224         �           0    0    TeamPlayerELOLog_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."TeamPlayerELOLog_id_seq"', 180, true);
          public          postgres    false    227         �           0    0    Team_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Team_id_seq"', 42, true);
          public          postgres    false    222         �           2606    17316    ELOLog ELOLog_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."ELOLog"
    ADD CONSTRAINT "ELOLog_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."ELOLog" DROP CONSTRAINT "ELOLog_pkey";
       public            postgres    false    221         �           2606    17308    Match Match_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Match" DROP CONSTRAINT "Match_pkey";
       public            postgres    false    219         �           2606    17300    Player Player_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT "Player_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Player" DROP CONSTRAINT "Player_pkey";
       public            postgres    false    217         �           2606    17418    TeamELOLog TeamELOLog_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."TeamELOLog"
    ADD CONSTRAINT "TeamELOLog_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."TeamELOLog" DROP CONSTRAINT "TeamELOLog_pkey";
       public            postgres    false    230         �           2606    17357    TeamMatch TeamMatch_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."TeamMatch"
    ADD CONSTRAINT "TeamMatch_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."TeamMatch" DROP CONSTRAINT "TeamMatch_pkey";
       public            postgres    false    225         �           2606    17410 &   TeamPlayerELOLog TeamPlayerELOLog_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."TeamPlayerELOLog"
    ADD CONSTRAINT "TeamPlayerELOLog_pkey" PRIMARY KEY (id);
 T   ALTER TABLE ONLY public."TeamPlayerELOLog" DROP CONSTRAINT "TeamPlayerELOLog_pkey";
       public            postgres    false    228         �           2606    17349    Team Team_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."Team" DROP CONSTRAINT "Team_pkey";
       public            postgres    false    223         �           2606    17290 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    215         �           1259    17319    ELOLog_playerId_idx    INDEX     P   CREATE INDEX "ELOLog_playerId_idx" ON public."ELOLog" USING btree ("playerId");
 )   DROP INDEX public."ELOLog_playerId_idx";
       public            postgres    false    221         �           1259    17318    Match_winnerId_loserId_idx    INDEX     a   CREATE INDEX "Match_winnerId_loserId_idx" ON public."Match" USING btree ("winnerId", "loserId");
 0   DROP INDEX public."Match_winnerId_loserId_idx";
       public            postgres    false    219    219         �           1259    17317    Player_name_key    INDEX     M   CREATE UNIQUE INDEX "Player_name_key" ON public."Player" USING btree (name);
 %   DROP INDEX public."Player_name_key";
       public            postgres    false    217         �           1259    17420    TeamELOLog_teamId_idx    INDEX     T   CREATE INDEX "TeamELOLog_teamId_idx" ON public."TeamELOLog" USING btree ("teamId");
 +   DROP INDEX public."TeamELOLog_teamId_idx";
       public            postgres    false    230         �           1259    17361 &   TeamMatch_winnerTeamId_loserTeamId_idx    INDEX     y   CREATE INDEX "TeamMatch_winnerTeamId_loserTeamId_idx" ON public."TeamMatch" USING btree ("winnerTeamId", "loserTeamId");
 <   DROP INDEX public."TeamMatch_winnerTeamId_loserTeamId_idx";
       public            postgres    false    225    225         �           1259    17419    TeamPlayerELOLog_playerId_idx    INDEX     d   CREATE INDEX "TeamPlayerELOLog_playerId_idx" ON public."TeamPlayerELOLog" USING btree ("playerId");
 3   DROP INDEX public."TeamPlayerELOLog_playerId_idx";
       public            postgres    false    228         �           1259    17362    _TeamMembers_AB_unique    INDEX     ^   CREATE UNIQUE INDEX "_TeamMembers_AB_unique" ON public."_TeamMembers" USING btree ("A", "B");
 ,   DROP INDEX public."_TeamMembers_AB_unique";
       public            postgres    false    226    226         �           1259    17363    _TeamMembers_B_index    INDEX     P   CREATE INDEX "_TeamMembers_B_index" ON public."_TeamMembers" USING btree ("B");
 *   DROP INDEX public."_TeamMembers_B_index";
       public            postgres    false    226         �           2606    17431    ELOLog ELOLog_matchId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ELOLog"
    ADD CONSTRAINT "ELOLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES public."Match"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 H   ALTER TABLE ONLY public."ELOLog" DROP CONSTRAINT "ELOLog_matchId_fkey";
       public          postgres    false    221    3264    219         �           2606    17335    ELOLog ELOLog_playerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ELOLog"
    ADD CONSTRAINT "ELOLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."ELOLog" DROP CONSTRAINT "ELOLog_playerId_fkey";
       public          postgres    false    221    217    3262         �           2606    17325    Match Match_loserId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 F   ALTER TABLE ONLY public."Match" DROP CONSTRAINT "Match_loserId_fkey";
       public          postgres    false    219    3262    217         �           2606    17330    Match Match_playerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 G   ALTER TABLE ONLY public."Match" DROP CONSTRAINT "Match_playerId_fkey";
       public          postgres    false    3262    217    219         �           2606    17320    Match Match_winnerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY public."Match" DROP CONSTRAINT "Match_winnerId_fkey";
       public          postgres    false    219    217    3262         �           2606    17426 !   TeamELOLog TeamELOLog_teamId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TeamELOLog"
    ADD CONSTRAINT "TeamELOLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 O   ALTER TABLE ONLY public."TeamELOLog" DROP CONSTRAINT "TeamELOLog_teamId_fkey";
       public          postgres    false    223    3270    230         �           2606    17451 &   TeamELOLog TeamELOLog_teamMatchId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TeamELOLog"
    ADD CONSTRAINT "TeamELOLog_teamMatchId_fkey" FOREIGN KEY ("teamMatchId") REFERENCES public."TeamMatch"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."TeamELOLog" DROP CONSTRAINT "TeamELOLog_teamMatchId_fkey";
       public          postgres    false    3272    230    225         �           2606    17374 $   TeamMatch TeamMatch_loserTeamId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TeamMatch"
    ADD CONSTRAINT "TeamMatch_loserTeamId_fkey" FOREIGN KEY ("loserTeamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 R   ALTER TABLE ONLY public."TeamMatch" DROP CONSTRAINT "TeamMatch_loserTeamId_fkey";
       public          postgres    false    223    225    3270         �           2606    17369 %   TeamMatch TeamMatch_winnerTeamId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TeamMatch"
    ADD CONSTRAINT "TeamMatch_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY public."TeamMatch" DROP CONSTRAINT "TeamMatch_winnerTeamId_fkey";
       public          postgres    false    223    3270    225         �           2606    17421 /   TeamPlayerELOLog TeamPlayerELOLog_playerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TeamPlayerELOLog"
    ADD CONSTRAINT "TeamPlayerELOLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 ]   ALTER TABLE ONLY public."TeamPlayerELOLog" DROP CONSTRAINT "TeamPlayerELOLog_playerId_fkey";
       public          postgres    false    3262    217    228         �           2606    17446 2   TeamPlayerELOLog TeamPlayerELOLog_teamMatchId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TeamPlayerELOLog"
    ADD CONSTRAINT "TeamPlayerELOLog_teamMatchId_fkey" FOREIGN KEY ("teamMatchId") REFERENCES public."TeamMatch"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."TeamPlayerELOLog" DROP CONSTRAINT "TeamPlayerELOLog_teamMatchId_fkey";
       public          postgres    false    3272    228    225         �           2606    17379     _TeamMembers _TeamMembers_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_TeamMembers"
    ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";
       public          postgres    false    226    217    3262         �           2606    17384     _TeamMembers _TeamMembers_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."_TeamMembers"
    ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";
       public          postgres    false    3270    226    223                                                                                                                                                                                                                                                                                                                                                                                                       3444.dat                                                                                            0000600 0004000 0002000 00000025466 14561673262 0014301 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1	1525	2024-01-01 13:33:24.367	1
2	2	1475	2024-01-01 13:33:24.386	1
3	1	1568	2024-01-03 12:18:27.443	2
4	2	1432	2024-01-03 12:18:27.45	2
5	1	1599	2024-01-03 12:27:38.703	3
6	2	1401	2024-01-03 12:27:38.71	3
7	8	1550	2024-01-03 12:52:00.428	4
8	9	1450	2024-01-03 12:52:00.435	4
9	6	1550	2024-01-03 13:11:14.076	5
10	5	1450	2024-01-03 13:11:14.083	5
11	1	1635	2024-01-03 16:14:33.038	6
12	4	1464	2024-01-03 16:14:33.044	6
13	1	1662	2024-01-03 16:14:51.024	7
14	4	1437	2024-01-03 16:14:51.03	7
15	3	1557	2024-01-04 11:32:51.773	8
16	6	1493	2024-01-04 11:32:51.78	8
17	8	1586	2024-01-04 14:56:20.291	9
18	9	1414	2024-01-04 14:56:20.298	9
19	3	1498	2024-01-05 12:48:54.338	10
20	6	1552	2024-01-05 12:48:54.345	10
21	1	1590	2024-01-05 14:37:26.826	11
22	3	1570	2024-01-05 14:37:26.833	11
23	1	1635	2024-01-05 14:50:00.241	12
24	6	1507	2024-01-05 14:50:00.248	12
25	3	1611	2024-01-05 14:57:02.879	13
26	6	1466	2024-01-05 14:57:02.888	13
27	1	1662	2024-01-05 15:10:04.489	14
28	6	1439	2024-01-05 15:10:04.497	14
29	1	1684	2024-01-05 15:30:58.567	15
30	6	1417	2024-01-05 15:30:58.576	15
31	6	1472	2024-01-08 10:34:05.396	16
32	5	1395	2024-01-08 10:34:05.402	16
33	3	1542	2024-01-08 11:22:09.452	17
34	6	1541	2024-01-08 11:22:09.458	17
35	1	1703	2024-01-08 16:06:49.014	18
36	4	1418	2024-01-08 16:06:49.026	18
37	5	1365	2024-01-09 11:01:00.847	19
38	3	1572	2024-01-09 11:01:00.853	19
39	6	1568	2024-01-09 11:10:16.636	20
40	5	1338	2024-01-09 11:10:16.643	20
41	3	1593	2024-01-09 14:00:55.794	21
42	5	1317	2024-01-09 14:00:55.801	21
43	3	1610	2024-01-10 10:32:23.182	22
44	5	1300	2024-01-10 10:32:23.188	22
45	6	1486	2024-01-10 10:40:49.457	23
46	5	1382	2024-01-10 10:40:49.464	23
47	3	1543	2024-01-10 10:47:44.558	24
48	6	1553	2024-01-10 10:47:44.564	24
49	6	1595	2024-01-11 11:09:44.918	25
50	14	1458	2024-01-11 11:09:44.925	25
51	9	1487	2024-01-11 11:58:29.815	26
52	8	1513	2024-01-11 11:58:29.822	26
53	6	1633	2024-01-12 11:34:50.995	27
54	8	1475	2024-01-12 11:34:51.002	27
55	8	1427	2024-01-12 12:44:26.057	28
56	9	1535	2024-01-12 12:44:26.066	28
57	6	1654	2024-01-12 13:40:16.854	29
58	2	1380	2024-01-12 13:40:16.86	29
59	6	1711	2024-01-12 14:58:50.951	30
60	1	1646	2024-01-12 14:58:50.957	30
61	1	1705	2024-01-12 15:11:14.234	31
62	6	1652	2024-01-12 15:11:14.241	31
63	3	1508	2024-01-15 10:36:06.615	32
64	6	1687	2024-01-15 10:36:06.621	32
65	3	1441	2024-01-15 10:43:02.851	33
66	5	1449	2024-01-15 10:43:02.857	33
67	1	1723	2024-01-15 11:02:51.323	34
68	3	1423	2024-01-15 11:02:51.328	34
69	6	1742	2024-01-15 11:11:44.407	35
70	1	1668	2024-01-15 11:11:44.413	35
71	3	1477	2024-01-15 14:10:58.493	36
72	5	1395	2024-01-15 14:10:58.499	36
73	6	1754	2024-01-15 14:17:12.412	37
74	5	1383	2024-01-15 14:17:12.418	37
75	6	1765	2024-01-15 14:22:43.82	38
76	5	1372	2024-01-15 14:22:43.826	38
77	6	1674	2024-01-15 14:33:34.681	39
78	5	1463	2024-01-15 14:33:34.686	39
79	1	1687	2024-01-15 15:18:36.048	40
80	4	1399	2024-01-15 15:18:36.057	40
81	1	1703	2024-01-15 15:18:58.62	41
82	4	1383	2024-01-15 15:18:58.625	41
83	6	1728	2024-01-16 11:19:09.759	42
84	1	1649	2024-01-16 11:19:09.765	42
85	1	1710	2024-01-16 11:29:51.246	43
86	6	1667	2024-01-16 11:29:51.251	43
87	6	1691	2024-01-16 12:06:03.573	44
88	5	1439	2024-01-16 12:06:03.578	44
89	6	1710	2024-01-16 12:12:11.82	45
90	5	1420	2024-01-16 12:12:11.825	45
91	1	1760	2024-01-16 15:36:49.12	46
92	6	1660	2024-01-16 15:36:49.125	46
93	1	1796	2024-01-16 15:49:31.74	47
94	6	1624	2024-01-16 15:49:31.747	47
95	1	1806	2024-01-16 15:55:56.684	48
96	5	1410	2024-01-16 15:55:56.689	48
97	6	1647	2024-01-16 16:00:35.508	49
98	5	1387	2024-01-16 16:00:35.513	49
99	1	1835	2024-01-16 16:11:09.652	50
100	6	1618	2024-01-16 16:11:09.657	50
101	5	1350	2024-01-17 09:21:45.937	51
102	3	1514	2024-01-17 09:21:45.943	51
103	2	1437	2024-01-17 12:31:05.324	52
104	8	1370	2024-01-17 12:31:05.329	52
105	14	1430	2024-01-17 12:45:14.762	53
106	6	1646	2024-01-17 12:45:14.768	53
107	8	1442	2024-01-17 14:23:59.059	54
108	9	1463	2024-01-17 14:23:59.065	54
109	3	1554	2024-01-17 14:35:48.67	55
110	8	1402	2024-01-17 14:35:48.675	55
111	1	1841	2024-01-17 16:14:09.998	56
112	5	1344	2024-01-17 16:14:10.004	56
113	1	1846	2024-01-17 16:14:23.643	57
114	5	1339	2024-01-17 16:14:23.649	57
115	1	1870	2024-01-19 16:20:38.87	58
116	6	1622	2024-01-19 16:20:38.877	58
117	1	1889	2024-01-22 10:47:34.046	59
118	6	1603	2024-01-22 10:47:34.053	59
119	6	1687	2024-01-22 11:04:21.351	60
120	1	1805	2024-01-22 11:04:21.357	60
121	3	1535	2024-01-23 10:37:23.806	61
122	1	1824	2024-01-23 10:37:23.812	61
123	3	1506	2024-01-23 10:42:02.062	62
124	6	1716	2024-01-23 10:42:02.069	62
125	6	1733	2024-01-23 12:08:54.205	63
126	2	1420	2024-01-23 12:08:54.212	63
127	6	1654	2024-01-23 14:02:04.559	64
128	3	1585	2024-01-23 14:02:04.565	64
129	1	1844	2024-01-23 14:57:58.455	65
130	3	1565	2024-01-23 14:57:58.46	65
131	1	1861	2024-01-23 15:09:53.825	66
132	3	1548	2024-01-23 15:09:53.83	66
133	8	1455	2024-01-24 07:26:39.045	67
134	2	1367	2024-01-24 07:26:39.052	67
135	8	1506	2024-01-24 09:56:41.454	68
136	9	1412	2024-01-24 09:56:41.459	68
137	6	1589	2024-01-24 11:54:43.086	69
138	3	1613	2024-01-24 11:54:43.093	69
139	3	1560	2024-01-24 12:02:29.755	70
140	6	1642	2024-01-24 12:02:29.761	70
141	8	1537	2024-01-24 14:47:52.171	71
142	2	1336	2024-01-24 14:47:52.177	71
143	3	1482	2024-01-24 15:29:08.613	72
144	5	1417	2024-01-24 15:29:08.619	72
145	3	1423	2024-01-24 15:33:56.982	73
146	5	1476	2024-01-24 15:33:56.991	73
147	3	1481	2024-01-24 15:39:05.357	74
148	5	1418	2024-01-24 15:39:05.364	74
149	1	1868	2024-01-24 15:45:25.707	75
150	5	1411	2024-01-24 15:45:25.713	75
151	19	1469	2024-01-25 09:32:13.101	76
152	6	1673	2024-01-25 09:32:13.108	76
153	3	1429	2024-01-25 09:37:13.784	77
154	19	1521	2024-01-25 09:37:13.79	77
155	20	1437	2024-01-25 12:23:10.209	78
156	5	1474	2024-01-25 12:23:10.215	78
157	6	1693	2024-01-25 12:33:54.847	79
158	20	1417	2024-01-25 12:33:54.854	79
159	20	1479	2024-01-25 12:59:43.592	80
160	21	1438	2024-01-25 12:59:43.608	80
161	19	1464	2024-01-25 14:19:53.289	81
162	5	1531	2024-01-25 14:19:53.295	81
163	6	1722	2024-01-26 11:49:59.025	82
164	8	1508	2024-01-26 11:49:59.033	82
165	5	1478	2024-01-26 11:57:37.587	83
166	8	1561	2024-01-26 11:57:37.595	83
169	1	1872	2024-01-26 14:50:38.847	85
170	2	1332	2024-01-26 14:50:38.854	85
171	1	1886	2024-01-26 14:50:50.016	86
172	8	1547	2024-01-26 14:50:50.022	86
173	6	1694	2024-01-26 14:51:02.333	87
174	1	1914	2024-01-26 14:51:02.339	87
175	1	1922	2024-01-26 14:55:42.169	88
176	5	1470	2024-01-26 14:55:42.175	88
177	9	1481	2024-01-29 11:55:58.557	89
178	8	1478	2024-01-29 11:55:58.565	89
179	5	1448	2024-01-29 13:26:00.403	90
180	6	1716	2024-01-29 13:26:00.411	90
181	5	1430	2024-01-29 13:26:25.858	91
182	6	1734	2024-01-29 13:26:25.865	91
183	8	1528	2024-01-29 14:42:11.537	92
184	9	1431	2024-01-29 14:42:11.544	92
185	8	1464	2024-01-30 10:40:50.997	93
186	9	1495	2024-01-30 10:40:51.004	93
187	5	1480	2024-01-30 10:51:28.955	94
188	3	1379	2024-01-30 10:51:28.963	94
189	6	1745	2024-01-30 10:59:02.171	95
190	3	1368	2024-01-30 10:59:02.182	95
191	15	1550	2024-01-30 13:08:24.424	96
192	24	1450	2024-01-30 13:08:24.429	96
193	3	1431	2024-01-30 13:14:39.6	97
194	8	1401	2024-01-30 13:14:39.605	97
195	8	1489	2024-01-30 13:22:31.912	98
196	6	1657	2024-01-30 13:22:31.918	98
197	3	1425	2024-01-30 13:29:58.082	99
198	1	1928	2024-01-30 13:29:58.088	99
199	1	1945	2024-01-30 13:41:30.164	100
200	6	1640	2024-01-30 13:41:30.169	100
201	5	1531	2024-01-31 09:44:52.951	101
202	8	1438	2024-01-31 09:44:52.956	101
203	8	1386	2024-01-31 10:36:18.825	102
204	3	1477	2024-01-31 10:36:18.83	102
205	3	1535	2024-01-31 10:42:13.385	103
206	5	1473	2024-01-31 10:42:13.396	103
207	1	1854	2024-01-31 10:54:05.847	104
208	3	1626	2024-01-31 10:54:05.852	104
209	1	1875	2024-01-31 11:04:38.266	105
210	3	1605	2024-01-31 11:04:38.272	105
211	1	1896	2024-01-31 11:12:55.692	106
212	6	1619	2024-01-31 11:12:55.699	106
213	8	1451	2024-01-31 12:01:30.932	107
214	9	1430	2024-01-31 12:01:30.938	107
215	9	1483	2024-01-31 12:49:03.635	108
216	8	1398	2024-01-31 12:49:03.641	108
217	8	1460	2024-01-31 13:23:19.795	109
218	9	1421	2024-01-31 13:23:19.8	109
219	6	1649	2024-01-31 13:34:09.719	110
220	5	1443	2024-01-31 13:34:09.725	110
221	6	1672	2024-01-31 13:34:23.46	111
222	5	1420	2024-01-31 13:34:23.466	111
223	6	1595	2024-01-31 14:05:47.555	112
224	8	1537	2024-01-31 14:05:47.561	112
225	8	1471	2024-01-31 14:13:12.425	113
226	5	1486	2024-01-31 14:13:12.432	113
227	3	1539	2024-01-31 14:18:14.638	114
228	5	1552	2024-01-31 14:18:14.645	114
229	8	1531	2024-01-31 14:22:44.136	115
230	3	1479	2024-01-31 14:22:44.143	115
231	8	1566	2024-02-01 09:05:15.62	116
232	9	1386	2024-02-01 09:05:15.626	116
233	5	1585	2024-02-01 11:00:16.38	117
234	14	1397	2024-02-01 11:00:16.387	117
235	8	1604	2024-02-01 14:08:39.321	118
236	3	1441	2024-02-01 14:08:39.328	118
237	9	1344	2024-02-01 14:15:51.598	119
238	3	1483	2024-02-01 14:15:51.603	119
239	3	1514	2024-02-01 14:22:55.056	120
240	9	1313	2024-02-01 14:22:55.063	120
241	8	1620	2024-02-02 08:43:25.703	121
242	9	1297	2024-02-02 08:43:25.711	121
243	16	1462	2024-02-02 10:41:27.846	122
244	5	1623	2024-02-02 10:41:27.852	122
245	1	1904	2024-02-02 10:56:53.325	123
246	16	1454	2024-02-02 10:56:53.338	123
247	6	1649	2024-02-02 11:13:56.635	124
248	5	1569	2024-02-02 11:13:56.641	124
249	6	1688	2024-02-02 11:24:44.403	125
250	5	1530	2024-02-02 11:24:44.409	125
251	5	1501	2024-02-02 12:56:18.326	126
252	6	1717	2024-02-02 12:56:18.331	126
253	6	1739	2024-02-02 12:56:35.873	127
254	5	1479	2024-02-02 12:56:35.878	127
255	5	1471	2024-02-02 13:49:57.92	128
256	1	1912	2024-02-02 13:49:57.926	128
257	1	1919	2024-02-02 13:50:20.821	129
258	5	1464	2024-02-02 13:50:20.831	129
259	1	1945	2024-02-02 14:06:07.752	130
260	6	1713	2024-02-02 14:06:07.758	130
261	1	1952	2024-02-02 14:18:15.989	131
262	25	1493	2024-02-02 14:18:15.996	131
263	6	1732	2024-02-05 11:09:07.086	132
264	5	1445	2024-02-05 11:09:07.093	132
265	3	1592	2024-02-05 11:17:55.735	133
266	6	1654	2024-02-05 11:17:55.742	133
267	5	1422	2024-02-06 10:31:43.642	134
268	6	1677	2024-02-06 10:31:43.649	134
269	8	1644	2024-02-06 12:22:12.098	135
270	5	1398	2024-02-06 12:22:12.105	135
271	5	1373	2024-02-06 12:39:24.513	136
272	3	1617	2024-02-06 12:39:24.522	136
273	5	1358	2024-02-06 12:44:23.144	137
274	6	1692	2024-02-06 12:44:23.149	137
275	3	1535	2024-02-06 14:13:49.071	138
276	5	1440	2024-02-06 14:13:49.078	138
277	3	1572	2024-02-06 14:14:08.699	139
278	5	1403	2024-02-06 14:14:08.704	139
279	3	1499	2024-02-06 14:14:24.329	140
280	5	1476	2024-02-06 14:14:24.335	140
281	8	1556	2024-02-06 14:30:52.53	141
282	9	1385	2024-02-06 14:30:52.543	141
283	1	1956	2024-02-06 15:47:16.262	142
284	4	1379	2024-02-06 15:47:16.268	142
285	1	1959	2024-02-06 15:47:35.603	143
286	4	1376	2024-02-06 15:47:35.608	143
287	9	1458	2024-02-09 09:50:14.815	144
288	8	1483	2024-02-09 09:50:14.821	144
289	19	1443	2024-02-09 10:54:07.787	145
290	6	1713	2024-02-09 10:54:07.793	145
291	15	1477	2024-02-09 11:42:10.126	146
292	4	1449	2024-02-09 11:42:10.131	146
293	8	1429	2024-02-09 13:11:28.348	147
294	9	1512	2024-02-09 13:11:28.36	147
\.


                                                                                                                                                                                                          3442.dat                                                                                            0000600 0004000 0002000 00000015375 14561673262 0014275 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	2024-01-01 13:33:24.358	1	2	1525	1475	\N	\N
2	2024-01-03 12:18:27.434	1	2	1568	1432	\N	\N
3	2024-01-03 12:27:38.694	1	2	1599	1401	\N	\N
4	2024-01-03 12:52:00.418	8	9	1550	1450	\N	\N
5	2024-01-03 13:11:14.067	6	5	1550	1450	\N	\N
6	2024-01-03 16:14:33.027	1	4	1635	1464	\N	\N
7	2024-01-03 16:14:51.017	1	4	1662	1437	\N	\N
8	2024-01-04 11:32:51.763	3	6	1557	1493	\N	\N
9	2024-01-04 14:56:20.282	8	9	1586	1414	\N	\N
10	2024-01-05 12:48:54.329	6	3	1498	1552	\N	\N
11	2024-01-05 14:37:26.818	3	1	1590	1570	\N	\N
12	2024-01-05 14:50:00.232	1	6	1635	1507	\N	\N
13	2024-01-05 14:57:02.863	3	6	1611	1466	\N	\N
14	2024-01-05 15:10:04.478	1	6	1662	1439	\N	\N
15	2024-01-05 15:30:58.556	1	6	1684	1417	\N	\N
16	2024-01-08 10:34:05.388	6	5	1472	1395	\N	\N
17	2024-01-08 11:22:09.443	6	3	1542	1541	\N	\N
18	2024-01-08 16:06:49	1	4	1703	1418	\N	\N
19	2024-01-09 11:01:00.837	3	5	1365	1572	\N	\N
20	2024-01-09 11:10:16.627	6	5	1568	1338	\N	\N
21	2024-01-09 14:00:55.784	3	5	1593	1317	\N	\N
22	2024-01-10 10:32:23.172	3	5	1610	1300	\N	\N
23	2024-01-10 10:40:49.446	5	6	1486	1382	\N	\N
24	2024-01-10 10:47:44.55	6	3	1543	1553	\N	\N
25	2024-01-11 11:09:44.911	6	14	1595	1458	\N	\N
26	2024-01-11 11:58:29.807	9	8	1487	1513	\N	\N
27	2024-01-12 11:34:50.986	6	8	1633	1475	\N	\N
28	2024-01-12 12:44:26.04	9	8	1427	1535	\N	\N
29	2024-01-12 13:40:16.848	6	2	1654	1380	\N	\N
30	2024-01-12 14:58:50.937	6	1	1711	1646	\N	\N
31	2024-01-12 15:11:14.225	1	6	1705	1652	\N	\N
32	2024-01-15 10:36:06.607	6	3	1508	1687	\N	\N
33	2024-01-15 10:43:02.843	5	3	1441	1449	\N	\N
34	2024-01-15 11:02:51.317	1	3	1723	1423	\N	\N
35	2024-01-15 11:11:44.396	6	1	1742	1668	\N	\N
36	2024-01-15 14:10:58.486	3	5	1477	1395	\N	\N
37	2024-01-15 14:17:12.404	6	5	1754	1383	\N	\N
38	2024-01-15 14:22:43.808	6	5	1765	1372	\N	\N
39	2024-01-15 14:33:34.669	5	6	1674	1463	\N	\N
40	2024-01-15 15:18:36.042	1	4	1687	1399	\N	\N
41	2024-01-15 15:18:58.613	1	4	1703	1383	\N	\N
42	2024-01-16 11:19:09.747	6	1	1728	1649	\N	\N
43	2024-01-16 11:29:51.234	1	6	1710	1667	\N	\N
44	2024-01-16 12:06:03.566	6	5	1691	1439	\N	\N
45	2024-01-16 12:12:11.813	6	5	1710	1420	\N	\N
46	2024-01-16 15:36:49.113	1	6	1760	1660	\N	\N
47	2024-01-16 15:49:31.73	1	6	1796	1624	\N	\N
48	2024-01-16 15:55:56.678	1	5	1806	1410	\N	\N
49	2024-01-16 16:00:35.501	6	5	1647	1387	\N	\N
50	2024-01-16 16:11:09.645	1	6	1835	1618	\N	\N
51	2024-01-17 09:21:45.929	3	5	1350	1514	\N	\N
52	2024-01-17 12:31:05.317	2	8	1437	1370	\N	\N
53	2024-01-17 12:45:14.754	6	14	1430	1646	\N	\N
54	2024-01-17 14:23:59.051	8	9	1442	1463	\N	\N
55	2024-01-17 14:35:48.663	3	8	1554	1402	\N	\N
56	2024-01-17 16:14:09.992	1	5	1841	1344	\N	\N
57	2024-01-17 16:14:23.637	1	5	1846	1339	\N	\N
58	2024-01-19 16:20:38.861	1	6	1870	1622	\N	\N
59	2024-01-22 10:47:34.035	1	6	1889	1603	\N	\N
60	2024-01-22 11:04:21.342	6	1	1687	1805	\N	\N
61	2024-01-23 10:37:23.799	1	3	1535	1824	\N	\N
62	2024-01-23 10:42:02.053	6	3	1506	1716	\N	\N
63	2024-01-23 12:08:54.198	6	2	1733	1420	\N	\N
64	2024-01-23 14:02:04.553	3	6	1654	1585	\N	\N
65	2024-01-23 14:57:58.449	1	3	1844	1565	\N	\N
66	2024-01-23 15:09:53.819	1	3	1861	1548	\N	\N
67	2024-01-24 07:26:39.036	8	2	1455	1367	\N	\N
68	2024-01-24 09:56:41.447	8	9	1506	1412	\N	\N
69	2024-01-24 11:54:43.077	3	6	1589	1613	\N	\N
70	2024-01-24 12:02:29.747	6	3	1560	1642	\N	\N
71	2024-01-24 14:47:52.164	8	2	1537	1336	\N	\N
72	2024-01-24 15:29:08.605	5	3	1482	1417	\N	\N
73	2024-01-24 15:33:56.976	5	3	1423	1476	\N	\N
74	2024-01-24 15:39:05.342	3	5	1481	1418	\N	\N
75	2024-01-24 15:45:25.701	1	5	1868	1411	\N	\N
76	2024-01-25 09:32:13.094	6	19	1469	1673	\N	\N
77	2024-01-25 09:37:13.775	19	3	1429	1521	\N	\N
78	2024-01-25 12:23:10.2	5	20	1437	1474	\N	\N
79	2024-01-25 12:33:54.839	6	20	1693	1417	\N	\N
80	2024-01-25 12:59:43.583	20	21	1479	1438	\N	\N
81	2024-01-25 14:19:53.282	5	19	1464	1531	\N	\N
82	2024-01-26 11:49:59.015	6	8	1722	1508	\N	\N
83	2024-01-26 11:57:37.578	8	5	1478	1561	\N	\N
85	2024-01-26 14:50:38.838	1	2	1872	1332	\N	\N
86	2024-01-26 14:50:50.01	1	8	1886	1547	\N	\N
87	2024-01-26 14:51:02.325	1	6	1694	1914	\N	\N
88	2024-01-26 14:55:42.156	1	5	1922	1470	\N	\N
89	2024-01-29 11:55:58.548	9	8	1481	1478	\N	\N
90	2024-01-29 13:26:00.393	6	5	1448	1716	\N	\N
91	2024-01-29 13:26:25.852	6	5	1430	1734	\N	\N
92	2024-01-29 14:42:11.528	8	9	1528	1431	\N	\N
93	2024-01-30 10:40:50.989	9	8	1464	1495	\N	\N
94	2024-01-30 10:51:28.946	5	3	1480	1379	\N	\N
95	2024-01-30 10:59:02.157	6	3	1745	1368	\N	\N
96	2024-01-30 13:08:24.412	15	24	1550	1450	\N	\N
97	2024-01-30 13:14:39.593	3	8	1431	1401	\N	\N
98	2024-01-30 13:22:31.905	8	6	1489	1657	\N	\N
99	2024-01-30 13:29:58.068	1	3	1425	1928	\N	\N
100	2024-01-30 13:41:30.156	1	6	1945	1640	\N	\N
101	2024-01-31 09:44:52.944	5	8	1531	1438	\N	\N
102	2024-01-31 10:36:18.817	3	8	1386	1477	\N	\N
103	2024-01-31 10:42:13.378	3	5	1535	1473	\N	\N
104	2024-01-31 10:54:05.84	3	1	1854	1626	\N	\N
105	2024-01-31 11:04:38.26	1	3	1875	1605	\N	\N
106	2024-01-31 11:12:55.685	1	6	1896	1619	\N	\N
107	2024-01-31 12:01:30.926	8	9	1451	1430	\N	\N
108	2024-01-31 12:49:03.63	9	8	1483	1398	\N	\N
109	2024-01-31 13:23:19.788	8	9	1460	1421	\N	\N
110	2024-01-31 13:34:09.707	6	5	1649	1443	\N	\N
111	2024-01-31 13:34:23.448	6	5	1672	1420	\N	\N
112	2024-01-31 14:05:47.548	8	6	1595	1537	\N	\N
113	2024-01-31 14:13:12.419	5	8	1471	1486	\N	\N
114	2024-01-31 14:18:14.628	5	3	1539	1552	\N	\N
115	2024-01-31 14:22:44.128	8	3	1531	1479	\N	\N
116	2024-02-01 09:05:15.611	8	9	1566	1386	\N	\N
117	2024-02-01 11:00:16.371	5	14	1585	1397	\N	\N
118	2024-02-01 14:08:39.311	8	3	1604	1441	\N	\N
119	2024-02-01 14:15:51.591	3	9	1483	1344	\N	\N
120	2024-02-01 14:22:55.047	3	9	1514	1313	\N	\N
121	2024-02-02 08:43:25.677	8	9	1620	1297	\N	\N
122	2024-02-02 10:41:27.837	5	16	1623	1462	\N	\N
123	2024-02-02 10:56:53.318	1	16	1904	1454	\N	\N
124	2024-02-02 11:13:56.627	6	5	1649	1569	\N	\N
125	2024-02-02 11:24:44.396	6	5	1688	1530	\N	\N
126	2024-02-02 12:56:18.314	6	5	1717	1501	\N	\N
127	2024-02-02 12:56:35.867	6	5	1739	1479	\N	\N
128	2024-02-02 13:49:57.911	1	5	1912	1471	\N	\N
129	2024-02-02 13:50:20.815	1	5	1919	1464	\N	\N
130	2024-02-02 14:06:07.746	1	6	1945	1713	\N	\N
131	2024-02-02 14:18:15.975	1	25	1952	1493	\N	\N
132	2024-02-05 11:09:06.906	6	5	1732	1445	\N	\N
133	2024-02-05 11:17:55.726	3	6	1592	1654	\N	\N
134	2024-02-06 10:31:43.632	6	5	1677	1422	\N	\N
135	2024-02-06 12:22:12.089	8	5	1644	1398	\N	\N
136	2024-02-06 12:39:24.506	3	5	1617	1373	\N	\N
137	2024-02-06 12:44:23.137	6	5	1692	1358	\N	\N
138	2024-02-06 14:13:49.059	5	3	1440	1535	\N	\N
139	2024-02-06 14:14:08.692	3	5	1572	1403	\N	\N
140	2024-02-06 14:14:24.322	5	3	1476	1499	\N	\N
141	2024-02-06 14:30:52.522	9	8	1385	1556	\N	\N
142	2024-02-06 15:47:16.253	1	4	1956	1379	\N	\N
143	2024-02-06 15:47:35.596	1	4	1959	1376	\N	\N
144	2024-02-09 09:50:14.803	9	8	1458	1483	\N	\N
145	2024-02-09 10:54:07.779	6	19	1713	1443	\N	\N
146	2024-02-09 11:42:10.121	4	15	1449	1477	\N	\N
147	2024-02-09 13:11:28.34	9	8	1512	1429	\N	\N
\.


                                                                                                                                                                                                                                                                   3440.dat                                                                                            0000600 0004000 0002000 00000001316 14561673262 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        23	Thor	1500	1552	\N	1500
12	Nora	1500	1305	\N	1256
11	Henning	1500	1516	\N	1565
20	Billy	1479	1500	1417	\N
21	Rie	1438	1500	1500	\N
13	Anders	1500	1368	\N	1417
2	Georg	1332	1533	1336	1512
10	Johannes	1500	1447	\N	1500
3	Steffen	1499	1256	1572	1291
24	Tuva	1450	1500	1500	\N
5	Kristoffer	1476	1596	1403	1561
17	Sonja	1500	1474	\N	1500
1	Hogne	1959	1791	1956	1742
16	Aziz	1454	1446	1462	1500
19	Håvard GT	1443	1561	1464	1509
6	Geir Olav	1713	1784	1692	1750
7	Eirik	1500	1598	\N	1564
15	Maria	1477	1334	1550	1368
4	Sinan	1449	1685	1376	1719
8	Mathias	1429	1427	1483	1376
9	Jesper	1512	1486	1458	1540
25	Stian	1493	1500	1500	\N
18	Magnus	1500	1465	\N	1500
22	Connie	1500	1451	\N	1500
14	Håvard	1397	1425	1430	1450
\.


                                                                                                                                                                                                                                                                                                                  3446.dat                                                                                            0000600 0004000 0002000 00000001036 14561673263 0014267 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1450	1500
3	1550	1500
4	1450	1500
6	1450	1500
8	1550	1500
7	1685	1641
31	1455	1500
12	1450	1500
13	1550	1500
32	1450	1500
33	1550	1500
23	1654	1627
15	1550	1500
16	1423	1450
17	1486	1550
18	1514	1450
19	1471	1500
21	1450	1500
34	1550	1500
35	1450	1500
10	1605	1694
22	1450	1500
26	1551	1510
24	1407	1450
27	1457	1500
5	1559	1510
30	1451	1500
36	1450	1500
37	1550	1500
25	1593	1550
38	1457	1500
39	1550	1500
28	1586	1550
29	1414	1450
40	1496	1450
11	1378	1424
41	1416	1451
2	1591	1556
9	1463	1408
14	1388	1443
42	1557	1500
20	1493	1550
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  3453.dat                                                                                            0000600 0004000 0002000 00000006443 14561673263 0014274 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	1	1450	2024-01-02 10:32:42.713	1
2	2	1550	2024-01-02 10:32:42.716	1
3	3	1550	2024-01-03 10:50:56.437	2
4	4	1450	2024-01-03 10:50:56.44	2
5	5	1550	2024-01-05 11:03:42.618	3
6	6	1450	2024-01-05 11:03:42.622	3
7	5	1493	2024-01-08 11:05:55.36	4
8	7	1557	2024-01-08 11:05:55.364	4
9	7	1598	2024-01-08 11:18:37.386	5
10	5	1452	2024-01-08 11:18:37.389	5
11	8	1550	2024-01-08 12:56:50.144	6
12	9	1450	2024-01-08 12:56:50.148	6
13	10	1550	2024-01-09 10:26:16.742	7
14	11	1450	2024-01-09 10:26:16.746	7
15	10	1586	2024-01-09 10:31:23.233	8
16	11	1414	2024-01-09 10:31:23.236	8
17	12	1450	2024-01-09 13:29:18.067	9
18	13	1550	2024-01-09 13:29:18.07	9
19	9	1507	2024-01-09 13:30:17.764	10
20	14	1443	2024-01-09 13:30:17.767	10
21	11	1387	2024-01-10 14:11:10.612	11
22	10	1613	2024-01-10 14:11:10.615	11
23	10	1634	2024-01-10 14:18:39.76	12
24	11	1366	2024-01-10 14:18:39.762	12
25	11	1348	2024-01-10 14:25:06.257	13
26	10	1652	2024-01-10 14:25:06.26	13
27	15	1550	2024-01-12 11:27:45.045	14
28	16	1450	2024-01-12 11:27:45.048	14
29	17	1550	2024-01-12 14:28:20.241	15
30	18	1450	2024-01-12 14:28:20.244	15
31	17	1486	2024-01-12 14:48:04.108	16
32	18	1514	2024-01-12 14:48:04.11	16
33	10	1681	2024-01-15 10:58:06.131	17
34	19	1471	2024-01-15 10:58:06.134	17
35	20	1550	2024-01-16 08:49:15.257	18
36	21	1450	2024-01-16 08:49:15.26	18
37	10	1694	2024-01-17 10:37:08.016	19
38	11	1335	2024-01-17 10:37:08.021	19
39	10	1605	2024-01-17 10:45:16.13	20
40	11	1424	2024-01-17 10:45:16.133	20
41	22	1450	2024-01-17 13:31:52.692	21
42	23	1550	2024-01-17 13:31:52.695	21
43	24	1450	2024-01-17 13:43:04.362	22
44	25	1550	2024-01-17 13:43:04.365	22
45	24	1407	2024-01-17 13:52:46.649	23
46	26	1543	2024-01-17 13:52:46.652	23
47	23	1593	2024-01-19 10:59:44.028	24
48	27	1457	2024-01-19 10:59:44.031	24
49	9	1449	2024-01-23 10:54:21.827	25
50	5	1510	2024-01-23 10:54:21.83	25
51	28	1550	2024-01-23 12:43:34.628	26
52	29	1450	2024-01-23 12:43:34.63	26
53	5	1559	2024-01-23 14:11:40.075	27
54	30	1451	2024-01-23 14:11:40.078	27
55	26	1600	2024-01-24 10:55:08.967	28
56	23	1536	2024-01-24 10:55:08.971	28
57	7	1641	2024-01-24 14:15:20.244	29
58	2	1507	2024-01-24 14:15:20.248	29
59	7	1685	2024-01-24 14:30:07.268	30
60	26	1556	2024-01-24 14:30:07.271	30
61	31	1455	2024-01-26 10:47:51.416	31
62	23	1581	2024-01-26 10:47:51.419	31
63	23	1627	2024-01-26 10:59:26.436	32
64	26	1510	2024-01-26 10:59:26.439	32
65	32	1450	2024-01-26 12:13:07.466	33
66	33	1550	2024-01-26 12:13:07.47	33
67	23	1654	2024-01-29 10:49:54.74	34
68	16	1423	2024-01-29 10:49:54.743	34
69	34	1550	2024-01-29 12:12:30.446	35
70	35	1450	2024-01-29 12:12:30.449	35
71	9	1408	2024-01-29 13:55:05.529	36
72	26	1551	2024-01-29 13:55:05.531	36
73	36	1450	2024-01-30 09:57:35.565	37
74	37	1550	2024-01-30 09:57:35.568	37
75	25	1593	2024-01-30 12:20:25.421	38
76	38	1457	2024-01-30 12:20:25.433	38
77	39	1550	2024-02-01 11:15:48.141	39
78	40	1450	2024-02-01 11:15:48.144	39
79	2	1556	2024-02-05 11:30:47.152	40
80	41	1451	2024-02-05 11:30:47.155	40
81	28	1586	2024-02-05 12:13:57.185	41
82	29	1414	2024-02-05 12:13:57.188	41
83	40	1496	2024-02-05 14:14:33.944	42
84	11	1378	2024-02-05 14:14:33.947	42
85	41	1416	2024-02-06 10:42:47.909	43
86	2	1591	2024-02-06 10:42:47.916	43
87	9	1463	2024-02-06 12:54:39.459	44
88	14	1388	2024-02-06 12:54:39.463	44
89	42	1557	2024-02-09 11:55:23.571	45
90	20	1493	2024-02-09 11:55:23.574	45
\.


                                                                                                                                                                                                                             3448.dat                                                                                            0000600 0004000 0002000 00000003557 14561673263 0014303 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	2024-01-02 10:32:42.7	2	1	1450	1550
2	2024-01-03 10:50:56.424	3	4	1550	1450
3	2024-01-05 11:03:42.601	5	6	1550	1450
4	2024-01-08 11:05:55.347	7	5	1493	1557
5	2024-01-08 11:18:37.375	7	5	1598	1452
6	2024-01-08 12:56:50.133	8	9	1550	1450
7	2024-01-09 10:26:16.719	10	11	1550	1450
8	2024-01-09 10:31:23.222	10	11	1586	1414
9	2024-01-09 13:29:18.049	13	12	1450	1550
10	2024-01-09 13:30:17.74	9	14	1507	1443
11	2024-01-10 14:11:10.601	10	11	1387	1613
12	2024-01-10 14:18:39.748	10	11	1634	1366
13	2024-01-10 14:25:06.245	10	11	1348	1652
14	2024-01-12 11:27:45.035	15	16	1550	1450
15	2024-01-12 14:28:20.232	17	18	1550	1450
16	2024-01-12 14:48:04.099	18	17	1486	1514
17	2024-01-15 10:58:06.121	10	19	1681	1471
18	2024-01-16 08:49:15.244	20	21	1550	1450
19	2024-01-17 10:37:08.002	10	11	1694	1335
20	2024-01-17 10:45:16.121	11	10	1605	1424
21	2024-01-17 13:31:52.682	23	22	1450	1550
22	2024-01-17 13:43:04.348	25	24	1450	1550
23	2024-01-17 13:52:46.639	26	24	1407	1543
24	2024-01-19 10:59:44.016	23	27	1593	1457
25	2024-01-23 10:54:21.81	5	9	1449	1510
26	2024-01-23 12:43:34.619	28	29	1550	1450
27	2024-01-23 14:11:40.063	5	30	1559	1451
28	2024-01-24 10:55:08.955	26	23	1600	1536
29	2024-01-24 14:15:20.232	7	2	1641	1507
30	2024-01-24 14:30:07.255	7	26	1685	1556
31	2024-01-26 10:47:51.404	23	31	1455	1581
32	2024-01-26 10:59:26.421	23	26	1627	1510
33	2024-01-26 12:13:07.452	33	32	1450	1550
34	2024-01-29 10:49:54.688	23	16	1654	1423
35	2024-01-29 12:12:30.437	34	35	1550	1450
36	2024-01-29 13:55:05.518	26	9	1408	1551
37	2024-01-30 09:57:35.556	37	36	1450	1550
38	2024-01-30 12:20:25.407	25	38	1593	1457
39	2024-02-01 11:15:48.128	39	40	1550	1450
40	2024-02-05 11:30:47.14	2	41	1556	1451
41	2024-02-05 12:13:57.174	28	29	1586	1414
42	2024-02-05 14:14:33.932	40	11	1496	1378
43	2024-02-06 10:42:47.897	2	41	1416	1591
44	2024-02-06 12:54:39.443	9	14	1463	1388
45	2024-02-09 11:55:23.561	42	20	1557	1493
\.


                                                                                                                                                 3451.dat                                                                                            0000600 0004000 0002000 00000015071 14561673263 0014267 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	3	1450	2024-01-02 10:32:42.735	1
2	4	1450	2024-01-02 10:32:42.739	1
3	5	1550	2024-01-02 10:32:42.741	1
4	6	1550	2024-01-02 10:32:42.744	1
5	1	1546	2024-01-03 10:50:56.46	2
6	7	1546	2024-01-03 10:50:56.463	2
7	4	1404	2024-01-03 10:50:56.466	2
8	2	1454	2024-01-03 10:50:56.468	2
9	6	1603	2024-01-05 11:03:42.641	3
10	3	1503	2024-01-05 11:03:42.644	3
11	1	1493	2024-01-05 11:03:42.654	3
12	10	1447	2024-01-05 11:03:42.657	3
13	6	1538	2024-01-08 11:05:55.386	4
14	3	1438	2024-01-08 11:05:55.389	4
15	1	1558	2024-01-08 11:05:55.391	4
16	4	1469	2024-01-08 11:05:55.393	4
17	4	1515	2024-01-08 11:18:37.405	5
18	1	1604	2024-01-08 11:18:37.408	5
19	6	1492	2024-01-08 11:18:37.41	5
20	3	1392	2024-01-08 11:18:37.412	5
21	2	1515	2024-01-08 12:56:50.163	6
22	11	1561	2024-01-08 12:56:50.17	6
23	12	1439	2024-01-08 12:56:50.172	6
24	1	1543	2024-01-08 12:56:50.174	6
25	1	1586	2024-01-09 10:26:16.763	7
26	6	1535	2024-01-09 10:26:16.765	7
27	3	1349	2024-01-09 10:26:16.768	7
28	5	1507	2024-01-09 10:26:16.779	7
29	1	1618	2024-01-09 10:31:23.256	8
30	6	1567	2024-01-09 10:31:23.26	8
31	3	1317	2024-01-09 10:31:23.262	8
32	5	1475	2024-01-09 10:31:23.264	8
33	12	1406	2024-01-09 13:29:18.085	9
34	13	1467	2024-01-09 13:29:18.088	9
35	11	1594	2024-01-09 13:29:18.09	9
36	1	1651	2024-01-09 13:29:18.092	9
37	12	1456	2024-01-09 13:30:17.783	10
38	1	1701	2024-01-09 13:30:17.786	10
39	13	1417	2024-01-09 13:30:17.788	10
40	11	1544	2024-01-09 13:30:17.79	10
41	5	1455	2024-01-10 14:11:10.631	11
42	3	1297	2024-01-10 14:11:10.634	11
43	6	1587	2024-01-10 14:11:10.639	11
44	1	1721	2024-01-10 14:11:10.641	11
45	6	1604	2024-01-10 14:18:39.784	12
46	1	1738	2024-01-10 14:18:39.788	12
47	5	1438	2024-01-10 14:18:39.79	12
48	3	1280	2024-01-10 14:18:39.793	12
49	3	1266	2024-01-10 14:25:06.275	13
50	5	1424	2024-01-10 14:25:06.278	13
51	1	1752	2024-01-10 14:25:06.28	13
52	6	1618	2024-01-10 14:25:06.282	13
53	1	1792	2024-01-12 11:27:45.062	14
54	9	1540	2024-01-12 11:27:45.065	14
55	8	1460	2024-01-12 11:27:45.067	14
56	6	1578	2024-01-12 11:27:45.069	14
57	6	1642	2024-01-12 14:28:20.259	15
58	4	1579	2024-01-12 14:28:20.262	15
59	1	1728	2024-01-12 14:28:20.264	15
60	15	1436	2024-01-12 14:28:20.267	15
61	6	1588	2024-01-12 14:48:04.133	16
62	4	1525	2024-01-12 14:48:04.136	16
63	1	1782	2024-01-12 14:48:04.137	16
64	15	1490	2024-01-12 14:48:04.139	16
65	1	1805	2024-01-15 10:58:06.157	17
66	6	1611	2024-01-15 10:58:06.16	17
67	5	1401	2024-01-15 10:58:06.162	17
68	4	1502	2024-01-15 10:58:06.164	17
69	4	1556	2024-01-16 08:49:15.275	18
70	15	1544	2024-01-16 08:49:15.277	18
71	7	1492	2024-01-16 08:49:15.279	18
72	16	1446	2024-01-16 08:49:15.281	18
73	1	1815	2024-01-17 10:37:08.04	19
74	6	1621	2024-01-17 10:37:08.043	19
75	5	1391	2024-01-17 10:37:08.045	19
76	3	1256	2024-01-17 10:37:08.047	19
77	1	1724	2024-01-17 10:45:16.147	20
78	6	1530	2024-01-17 10:45:16.15	20
79	3	1347	2024-01-17 10:45:16.152	20
80	5	1482	2024-01-17 10:45:16.154	20
81	3	1321	2024-01-17 13:31:52.71	21
82	17	1474	2024-01-17 13:31:52.717	21
83	5	1508	2024-01-17 13:31:52.719	21
84	1	1750	2024-01-17 13:31:52.721	21
85	12	1436	2024-01-17 13:43:04.386	22
86	3	1301	2024-01-17 13:43:04.389	22
87	2	1535	2024-01-17 13:43:04.391	22
88	1	1770	2024-01-17 13:43:04.393	22
89	12	1408	2024-01-17 13:52:46.674	23
90	3	1273	2024-01-17 13:52:46.677	23
91	2	1563	2024-01-17 13:52:46.679	23
92	6	1558	2024-01-17 13:52:46.681	23
93	1	1805	2024-01-19 10:59:44.063	24
94	5	1543	2024-01-19 10:59:44.066	24
95	6	1523	2024-01-19 10:59:44.068	24
96	18	1465	2024-01-19 10:59:44.07	24
97	1	1728	2024-01-23 10:54:21.845	25
98	12	1331	2024-01-23 10:54:21.849	25
99	6	1600	2024-01-23 10:54:21.85	25
100	3	1350	2024-01-23 10:54:21.853	25
101	7	1542	2024-01-23 12:43:34.645	26
102	4	1606	2024-01-23 12:43:34.648	26
103	15	1494	2024-01-23 12:43:34.65	26
104	14	1450	2024-01-23 12:43:34.652	26
105	6	1654	2024-01-23 14:11:40.101	27
106	3	1404	2024-01-23 14:11:40.104	27
107	8	1406	2024-01-23 14:11:40.106	27
108	9	1486	2024-01-23 14:11:40.108	27
109	6	1708	2024-01-24 10:55:08.986	28
110	2	1617	2024-01-24 10:55:08.992	28
111	5	1489	2024-01-24 10:55:08.994	28
112	1	1674	2024-01-24 10:55:08.996	28
113	4	1650	2024-01-24 14:15:20.27	29
114	1	1718	2024-01-24 14:15:20.274	29
115	5	1445	2024-01-24 14:15:20.276	29
116	6	1664	2024-01-24 14:15:20.279	29
117	4	1694	2024-01-24 14:30:07.288	30
118	1	1762	2024-01-24 14:30:07.292	30
119	6	1620	2024-01-24 14:30:07.294	30
120	2	1573	2024-01-24 14:30:07.3	30
121	19	1460	2024-01-26 10:47:51.434	31
122	2	1533	2024-01-26 10:47:51.443	31
123	1	1802	2024-01-26 10:47:51.446	31
124	5	1485	2024-01-26 10:47:51.448	31
125	5	1525	2024-01-26 10:59:26.456	32
126	1	1842	2024-01-26 10:59:26.46	32
127	6	1580	2024-01-26 10:59:26.462	32
128	2	1493	2024-01-26 10:59:26.464	32
129	2	1451	2024-01-26 12:13:07.501	33
130	5	1483	2024-01-26 12:13:07.51	33
131	6	1622	2024-01-26 12:13:07.513	33
132	11	1586	2024-01-26 12:13:07.515	33
133	1	1872	2024-01-29 10:49:54.759	34
134	5	1513	2024-01-29 10:49:54.762	34
135	8	1376	2024-01-29 10:49:54.764	34
136	6	1592	2024-01-29 10:49:54.773	34
137	7	1591	2024-01-29 12:12:30.469	35
138	19	1509	2024-01-29 12:12:30.472	35
139	15	1445	2024-01-29 12:12:30.475	35
140	22	1451	2024-01-29 12:12:30.477	35
141	12	1270	2024-01-29 13:55:05.546	36
142	1	1811	2024-01-29 13:55:05.548	36
143	6	1653	2024-01-29 13:55:05.551	36
144	2	1512	2024-01-29 13:55:05.553	36
145	7	1539	2024-01-30 09:57:35.59	37
146	15	1393	2024-01-30 09:57:35.593	37
147	23	1552	2024-01-30 09:57:35.595	37
148	19	1561	2024-01-30 09:57:35.597	37
149	1	1832	2024-01-30 12:20:25.452	38
150	2	1533	2024-01-30 12:20:25.455	38
151	11	1565	2024-01-30 12:20:25.458	38
152	12	1249	2024-01-30 12:20:25.46	38
153	8	1427	2024-02-01 11:15:48.162	39
154	5	1564	2024-02-01 11:15:48.174	39
155	12	1198	2024-02-01 11:15:48.177	39
156	6	1602	2024-02-01 11:15:48.179	39
157	6	1657	2024-02-05 11:30:47.171	40
158	5	1619	2024-02-05 11:30:47.178	40
159	1	1777	2024-02-05 11:30:47.181	40
160	3	1349	2024-02-05 11:30:47.183	40
161	7	1564	2024-02-05 12:13:57.205	41
162	4	1719	2024-02-05 12:13:57.208	41
163	14	1425	2024-02-05 12:13:57.21	41
164	15	1368	2024-02-05 12:13:57.212	41
165	6	1715	2024-02-05 14:14:33.961	42
166	12	1256	2024-02-05 14:14:33.964	42
167	5	1561	2024-02-05 14:14:33.966	42
168	3	1291	2024-02-05 14:14:33.977	42
169	1	1742	2024-02-06 10:42:47.933	43
170	3	1256	2024-02-06 10:42:47.936	43
171	5	1596	2024-02-06 10:42:47.938	43
172	6	1750	2024-02-06 10:42:47.94	43
173	1	1791	2024-02-06 12:54:39.479	44
174	12	1305	2024-02-06 12:54:39.483	44
175	11	1516	2024-02-06 12:54:39.485	44
176	13	1368	2024-02-06 12:54:39.487	44
177	6	1784	2024-02-09 11:55:23.59	45
178	7	1598	2024-02-09 11:55:23.598	45
179	15	1334	2024-02-09 11:55:23.6	45
180	4	1685	2024-02-09 11:55:23.602	45
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                       3449.dat                                                                                            0000600 0004000 0002000 00000000662 14561673263 0014276 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        3	1
4	1
5	2
6	2
1	3
7	3
2	4
4	4
3	5
6	5
1	6
10	6
4	7
1	7
11	8
2	8
12	9
1	9
1	10
6	10
5	11
3	11
12	12
13	12
11	13
1	13
13	14
11	14
1	15
9	15
6	16
8	16
4	17
6	17
15	18
1	18
4	19
5	19
15	20
4	20
7	21
16	21
3	22
17	22
1	23
5	23
12	24
3	24
2	25
1	25
6	26
2	26
6	27
18	27
4	28
7	28
14	29
15	29
9	30
8	30
19	31
2	31
2	32
5	32
11	33
6	33
7	34
19	34
15	35
22	35
7	36
15	36
23	37
19	37
11	38
12	38
8	39
5	39
12	40
6	40
1	41
3	41
6	42
7	42
\.


                                                                              3438.dat                                                                                            0000600 0004000 0002000 00000003371 14561673264 0014275 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        7850b6a0-339c-413e-8ca0-8bf38f472fd5	1b180199e6d033237c239b804624c2be351a1d77707f63b3692da5bb8d8c5b27	2024-01-01 12:03:55.084204+00	20231214102012_init	\N	\N	2024-01-01 12:03:54.07382+00	1
bd16921a-69b2-4cd3-beab-df33ae4a1604	be8f2456c753336d7e5560d2a6921b073fddcc78a3837eca2580feaebef20669	2024-01-01 12:03:56.627284+00	20231215131351_add_team	\N	\N	2024-01-01 12:03:55.493536+00	1
1a37e622-3918-4537-9486-068dd5659eb3	2d22322623ed418c64c90b46ce90ab472f6294ae512d51bf73186448e728260e	2024-01-01 12:03:58.054358+00	20231218181501_teams_there	\N	\N	2024-01-01 12:03:57.029716+00	1
dd80708b-83b2-40f2-aa0c-94013f1a1f68	52dc4731eb71de669dd8ad245be5eae601d35bada498f962065e581c848b814d	2024-01-01 12:03:59.48706+00	20231218183900_elo_on_team	\N	\N	2024-01-01 12:03:58.463438+00	1
b01b3618-bd6a-49fd-b32f-fe92799529a9	384f2973a9d97e1ff111d7b2689d99d12a97302b216ce8bc2f9a254266aa05ce	2024-01-01 12:04:00.920798+00	20231218184816_add_team_elo_to_player	\N	\N	2024-01-01 12:03:59.896664+00	1
4ff06767-64d8-4eda-ba75-468ad4de0b58	c7b384bb6b7670efcbabb1f68b5801ad2ed7196d0bbf3c3dc00cbf257c4028e4	2024-01-01 12:04:02.354302+00	20231218190600_more_changes	\N	\N	2024-01-01 12:04:01.330275+00	1
61bf3491-e612-4871-bdf5-085e0cc969b2	efe1e7f553e6715e5da538b93bf9716a5a53ff94ad179fc3e1a1c0955f06b4aa	2024-01-01 12:04:03.788027+00	20231221111727_easier_revert_match	\N	\N	2024-01-01 12:04:02.764251+00	1
e102416a-4669-4518-a7f8-d51634607cb5	4e8ea926e3c894090af5c9dbe3b624378d081a1eff869e801e245865e6f99b93	2024-01-01 12:04:05.221544+00	20231221121623_moremore	\N	\N	2024-01-01 12:04:04.198594+00	1
d4d591f5-a142-458a-82f3-9d194e59e166	731771a016322074d20177a09d0f2b16098ab1bc7a49570cc9591f7f2e46a39c	2024-01-26 14:46:03.947354+00	20240126144025_something_new	\N	\N	2024-01-26 14:46:03.938791+00	1
\.


                                                                                                                                                                                                                                                                       restore.sql                                                                                         0000600 0004000 0002000 00000046260 14561673264 0015412 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-1.pgdg120+1)
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE railway;
--
-- Name: railway; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE railway WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE railway OWNER TO postgres;

\connect railway

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ELOLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ELOLog" (
    id integer NOT NULL,
    "playerId" integer NOT NULL,
    elo integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "matchId" integer NOT NULL
);


ALTER TABLE public."ELOLog" OWNER TO postgres;

--
-- Name: ELOLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ELOLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ELOLog_id_seq" OWNER TO postgres;

--
-- Name: ELOLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ELOLog_id_seq" OWNED BY public."ELOLog".id;


--
-- Name: Match; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Match" (
    id integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "winnerId" integer NOT NULL,
    "loserId" integer NOT NULL,
    "winnerELO" integer NOT NULL,
    "loserELO" integer NOT NULL,
    "playerId" integer,
    "matchType" text
);


ALTER TABLE public."Match" OWNER TO postgres;

--
-- Name: Match_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Match_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Match_id_seq" OWNER TO postgres;

--
-- Name: Match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Match_id_seq" OWNED BY public."Match".id;


--
-- Name: Player; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Player" (
    id integer NOT NULL,
    name text NOT NULL,
    "currentELO" integer DEFAULT 1500 NOT NULL,
    "currentTeamELO" integer DEFAULT 1500 NOT NULL,
    "previousELO" integer,
    "previousTeamELO" integer
);


ALTER TABLE public."Player" OWNER TO postgres;

--
-- Name: Player_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Player_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Player_id_seq" OWNER TO postgres;

--
-- Name: Player_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Player_id_seq" OWNED BY public."Player".id;


--
-- Name: Team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Team" (
    id integer NOT NULL,
    "currentELO" integer DEFAULT 1500 NOT NULL,
    "previousELO" integer
);


ALTER TABLE public."Team" OWNER TO postgres;

--
-- Name: TeamELOLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamELOLog" (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    elo integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "teamMatchId" integer NOT NULL
);


ALTER TABLE public."TeamELOLog" OWNER TO postgres;

--
-- Name: TeamELOLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TeamELOLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TeamELOLog_id_seq" OWNER TO postgres;

--
-- Name: TeamELOLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TeamELOLog_id_seq" OWNED BY public."TeamELOLog".id;


--
-- Name: TeamMatch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamMatch" (
    id integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "winnerTeamId" integer NOT NULL,
    "loserTeamId" integer NOT NULL,
    "winnerELO" integer NOT NULL,
    "loserELO" integer NOT NULL
);


ALTER TABLE public."TeamMatch" OWNER TO postgres;

--
-- Name: TeamMatch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TeamMatch_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TeamMatch_id_seq" OWNER TO postgres;

--
-- Name: TeamMatch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TeamMatch_id_seq" OWNED BY public."TeamMatch".id;


--
-- Name: TeamPlayerELOLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamPlayerELOLog" (
    id integer NOT NULL,
    "playerId" integer NOT NULL,
    elo integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "teamMatchId" integer NOT NULL
);


ALTER TABLE public."TeamPlayerELOLog" OWNER TO postgres;

--
-- Name: TeamPlayerELOLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TeamPlayerELOLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TeamPlayerELOLog_id_seq" OWNER TO postgres;

--
-- Name: TeamPlayerELOLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TeamPlayerELOLog_id_seq" OWNED BY public."TeamPlayerELOLog".id;


--
-- Name: Team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Team_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Team_id_seq" OWNER TO postgres;

--
-- Name: Team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Team_id_seq" OWNED BY public."Team".id;


--
-- Name: _TeamMembers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_TeamMembers" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_TeamMembers" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: ELOLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ELOLog" ALTER COLUMN id SET DEFAULT nextval('public."ELOLog_id_seq"'::regclass);


--
-- Name: Match id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match" ALTER COLUMN id SET DEFAULT nextval('public."Match_id_seq"'::regclass);


--
-- Name: Player id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Player" ALTER COLUMN id SET DEFAULT nextval('public."Player_id_seq"'::regclass);


--
-- Name: Team id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team" ALTER COLUMN id SET DEFAULT nextval('public."Team_id_seq"'::regclass);


--
-- Name: TeamELOLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamELOLog" ALTER COLUMN id SET DEFAULT nextval('public."TeamELOLog_id_seq"'::regclass);


--
-- Name: TeamMatch id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMatch" ALTER COLUMN id SET DEFAULT nextval('public."TeamMatch_id_seq"'::regclass);


--
-- Name: TeamPlayerELOLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamPlayerELOLog" ALTER COLUMN id SET DEFAULT nextval('public."TeamPlayerELOLog_id_seq"'::regclass);


--
-- Data for Name: ELOLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ELOLog" (id, "playerId", elo, date, "matchId") FROM stdin;
\.
COPY public."ELOLog" (id, "playerId", elo, date, "matchId") FROM '$$PATH$$/3444.dat';

--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Match" (id, date, "winnerId", "loserId", "winnerELO", "loserELO", "playerId", "matchType") FROM stdin;
\.
COPY public."Match" (id, date, "winnerId", "loserId", "winnerELO", "loserELO", "playerId", "matchType") FROM '$$PATH$$/3442.dat';

--
-- Data for Name: Player; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Player" (id, name, "currentELO", "currentTeamELO", "previousELO", "previousTeamELO") FROM stdin;
\.
COPY public."Player" (id, name, "currentELO", "currentTeamELO", "previousELO", "previousTeamELO") FROM '$$PATH$$/3440.dat';

--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Team" (id, "currentELO", "previousELO") FROM stdin;
\.
COPY public."Team" (id, "currentELO", "previousELO") FROM '$$PATH$$/3446.dat';

--
-- Data for Name: TeamELOLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamELOLog" (id, "teamId", elo, date, "teamMatchId") FROM stdin;
\.
COPY public."TeamELOLog" (id, "teamId", elo, date, "teamMatchId") FROM '$$PATH$$/3453.dat';

--
-- Data for Name: TeamMatch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamMatch" (id, date, "winnerTeamId", "loserTeamId", "winnerELO", "loserELO") FROM stdin;
\.
COPY public."TeamMatch" (id, date, "winnerTeamId", "loserTeamId", "winnerELO", "loserELO") FROM '$$PATH$$/3448.dat';

--
-- Data for Name: TeamPlayerELOLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamPlayerELOLog" (id, "playerId", elo, date, "teamMatchId") FROM stdin;
\.
COPY public."TeamPlayerELOLog" (id, "playerId", elo, date, "teamMatchId") FROM '$$PATH$$/3451.dat';

--
-- Data for Name: _TeamMembers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_TeamMembers" ("A", "B") FROM stdin;
\.
COPY public."_TeamMembers" ("A", "B") FROM '$$PATH$$/3449.dat';

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.
COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM '$$PATH$$/3438.dat';

--
-- Name: ELOLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ELOLog_id_seq"', 294, true);


--
-- Name: Match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Match_id_seq"', 147, true);


--
-- Name: Player_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Player_id_seq"', 25, true);


--
-- Name: TeamELOLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TeamELOLog_id_seq"', 90, true);


--
-- Name: TeamMatch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TeamMatch_id_seq"', 45, true);


--
-- Name: TeamPlayerELOLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TeamPlayerELOLog_id_seq"', 180, true);


--
-- Name: Team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Team_id_seq"', 42, true);


--
-- Name: ELOLog ELOLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ELOLog"
    ADD CONSTRAINT "ELOLog_pkey" PRIMARY KEY (id);


--
-- Name: Match Match_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);


--
-- Name: Player Player_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT "Player_pkey" PRIMARY KEY (id);


--
-- Name: TeamELOLog TeamELOLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamELOLog"
    ADD CONSTRAINT "TeamELOLog_pkey" PRIMARY KEY (id);


--
-- Name: TeamMatch TeamMatch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMatch"
    ADD CONSTRAINT "TeamMatch_pkey" PRIMARY KEY (id);


--
-- Name: TeamPlayerELOLog TeamPlayerELOLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamPlayerELOLog"
    ADD CONSTRAINT "TeamPlayerELOLog_pkey" PRIMARY KEY (id);


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ELOLog_playerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ELOLog_playerId_idx" ON public."ELOLog" USING btree ("playerId");


--
-- Name: Match_winnerId_loserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Match_winnerId_loserId_idx" ON public."Match" USING btree ("winnerId", "loserId");


--
-- Name: Player_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Player_name_key" ON public."Player" USING btree (name);


--
-- Name: TeamELOLog_teamId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamELOLog_teamId_idx" ON public."TeamELOLog" USING btree ("teamId");


--
-- Name: TeamMatch_winnerTeamId_loserTeamId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamMatch_winnerTeamId_loserTeamId_idx" ON public."TeamMatch" USING btree ("winnerTeamId", "loserTeamId");


--
-- Name: TeamPlayerELOLog_playerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamPlayerELOLog_playerId_idx" ON public."TeamPlayerELOLog" USING btree ("playerId");


--
-- Name: _TeamMembers_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_TeamMembers_AB_unique" ON public."_TeamMembers" USING btree ("A", "B");


--
-- Name: _TeamMembers_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_TeamMembers_B_index" ON public."_TeamMembers" USING btree ("B");


--
-- Name: ELOLog ELOLog_matchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ELOLog"
    ADD CONSTRAINT "ELOLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES public."Match"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ELOLog ELOLog_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ELOLog"
    ADD CONSTRAINT "ELOLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_loserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Match Match_winnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamELOLog TeamELOLog_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamELOLog"
    ADD CONSTRAINT "TeamELOLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamELOLog TeamELOLog_teamMatchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamELOLog"
    ADD CONSTRAINT "TeamELOLog_teamMatchId_fkey" FOREIGN KEY ("teamMatchId") REFERENCES public."TeamMatch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamMatch TeamMatch_loserTeamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMatch"
    ADD CONSTRAINT "TeamMatch_loserTeamId_fkey" FOREIGN KEY ("loserTeamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamMatch TeamMatch_winnerTeamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMatch"
    ADD CONSTRAINT "TeamMatch_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamPlayerELOLog TeamPlayerELOLog_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamPlayerELOLog"
    ADD CONSTRAINT "TeamPlayerELOLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamPlayerELOLog TeamPlayerELOLog_teamMatchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamPlayerELOLog"
    ADD CONSTRAINT "TeamPlayerELOLog_teamMatchId_fkey" FOREIGN KEY ("teamMatchId") REFERENCES public."TeamMatch"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _TeamMembers _TeamMembers_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_TeamMembers"
    ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _TeamMembers _TeamMembers_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_TeamMembers"
    ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                