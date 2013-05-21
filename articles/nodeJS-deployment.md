Nachdem ich meine neue Homepage mit Hilfe von Node.JS geschrieben hatte stand ich vor einem Problem.
Ich fand im Netz kein einzig wirklich gutes deutsches Tutorial dazu, wie ich mein Express.JS hinter einen Apache stelle.
Nun ich finde die Lösung Node.JS hinter einen Apache Proxy zu stellen irgendwie relativ sinnlos, da man erst den
Apache starten muss und dann noch zusätzlich sich ein Monitoring tool holen muss, welches den Node.JS Prozess überwacht.

Da es aber momentan keine bessere Lösung gibt(wie evtl. mod_node :)) hier die Grundlagen:


### Was benötigt man?

* Apache Webserver (Version: 2.2)
* mod_proxy (bei Debian/Ubuntu bereits integriert)
* mod_proxy_http (wird normalerweise ebenfalls mitgeliefert)
* [NodeJS](https://nodejs.org) und [NPM](https://npmjs.org)


### Apache konfigurieren

<script src="https://gist.github.com/nirnanaaa/f963b39442eaee2e813c.js" type="text/javascript"></script>

Diese Datei ist die vhost config. D.h. sie sollte unter /etc/apache2/sites-available/<sitename> abgelegt werden.

Im Anschluss daran muss man die benötigten Module aktivieren:

```
# a2enmod proxy
# a2enmod proxy_http
```


... die vhost Konfiguration aktivieren

```shell
# a2ensite <sitename>
```

... und Apache neustarten
```shell
# /etc/init.d/apache2 restart
```

Damit ist von der Apache seite alles erledigt.

Alle Anfragen, welche jetzt <servername> auf Port 80 treffen werden somit auf `http://localhost:3000` umgeleitet.

### Node.JS konfigurieren

Als erstes muss ein Montoringdaemon installiert werden, welcher überwacht ob der Node.JS Prozess noch läuft.

Ich bevorzuge [Forever](https://github.com/nodejitsu/forever), welches stabil läuft und sehr flexibel ist.

Ein ausführliches Tutorial zu Forever findet man unter [diesem](https://github.com/nodejitsu/forever#using-forever-from-the-command-line) Link.

Installation:

```shell
# npm install forever -g
```

jetzt kann forever mittels des shell Befehls `forever` angesprochen werden.

Basics:

Node.JS server starten:
```shell
$ forever start app.js
```

Dieser Befehl sollte als unprivilegierter Benutzer ausgeführt werden, da sonst Sicherheitslücken entstehen können.

Mittels `forever list` kann man sich nun den Status aller forever Prozesse, des momentanen Benutzers anzeigen lassen.

```shell
$ forever list
info:    Forever processes running
data:        uid  command             script              forever   pid     logfile                    uptime        
data:        [0]   JUCn        /usr/local/bin/node app.js  9128    13875  /srv/web/.forever/JUCn.log 0:2:28:10.885
```


Jetzt kann auf die Node.JS seite per Apache proxy zugegriffen werden.



