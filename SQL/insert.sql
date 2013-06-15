/* insert users */
INSERT INTO seapal.benutzer (benutzername, passwort, vorname, nachname, mail, geburtsdatum, registrierung) VALUES ("dominic", "pwd", "Dominic", "Eschbach", "doeschba@htwg-konstanz.de", DATE("2012-07-04"), DATE("2012-10-03"));
INSERT INTO seapal.benutzer (benutzername, passwort, vorname, nachname, mail, geburtsdatum, registrierung) VALUES ("timo", "pwd", "Timo", "Partl", "tipartl@htwg-konstanz.de", DATE("2012-07-02"), DATE("2012-10-03"));

/* insert boats */
INSERT INTO seapal.bootinfo (bootname, registernummer, segelzeichen, heimathafen, yachtclub, eigner, versicherung, rufzeichen, typ, konstrukteur, laenge, breite, tiefgang, masthoehe, verdraengung, rigart, baujahr, motor, tankgroesse, wassertankgroesse, abwassertankgroesse, grosssegelgroesse, genuagroesse, spigroesse) VALUES ("Titanic", 101, "TI101", "New York", "New York Yacht Club", "George Boat", "Württembergische", "TI", "Schiff", "Peter Schiff", 200, 50, 7, 10, 1000, "T34", 1993, "Duotec 100", 500, 50, 30, 10, 25, 13);
INSERT INTO seapal.bootinfo (bootname, registernummer, segelzeichen, heimathafen, yachtclub, eigner, versicherung, rufzeichen, typ, konstrukteur, laenge, breite, tiefgang, masthoehe, verdraengung, rigart, baujahr, motor, tankgroesse, wassertankgroesse, abwassertankgroesse, grosssegelgroesse, genuagroesse, spigroesse) VALUES ("Queen Mary 2", 80, "QM80", "Dover", "Dover Yacht Club", "Hans Ebert", "Wüstenrot", "QM", "Schiff", "Rainer Berger", 200, 50, 7, 10, 1000, "T20", 1993, "Duotec 100", 500, 50, 30, 10, 25, 13);
INSERT INTO seapal.bootinfo (bootname, registernummer, segelzeichen, heimathafen, yachtclub, eigner, versicherung, rufzeichen, typ, konstrukteur, laenge, breite, tiefgang, masthoehe, verdraengung, rigart, baujahr, motor, tankgroesse, wassertankgroesse, abwassertankgroesse, grosssegelgroesse, genuagroesse, spigroesse) VALUES ("MS Deutschland", 150, "MSD15", "Hamburg", "Hamburg Yacht Club", "Peter Miller", "Allianz", "MSD", "Schiff", "Emil Klaus", 200, 50, 7, 10, 1000, "T27", 1993, "Duotec 100", 500, 50, 30, 10, 25, 13);

/* insert trips */
INSERT INTO seapal.tripinfo (titel, von, nach, skipper, crew, tstart, tende, tdauer, motor, tank) VALUES ("Langer Trip nach England", "Hamburg", "Dover", "Hr. Hein", "Martin Felix Manuel", DATE("2012-07-02"), DATE("2012-07-02"), 300, 1241, true);

INSERT INTO seapal.wegpunkte (tnr, name, btm, dtm, lat, lng, sog, cog, manoever, vorsegel, wdate, wtime, marker, 	
	wcc,icon, temp, airpressure, windspeed, winddirection, precipation, clouds, wavehight, wavedirection) VALUES 
	(1, "Marker 11", "btm", "dtm", "43", "-75", "sog", "cog", "manoever", "vorsegel", DATE("2013-06-13"), TIME("22:49"), "Ziel",
		501, "10d", 285, 999, 2, 276, 4, 82, NULL, NULL);
