# MMM-MPRIS2-WebSocket
[Magic Mirror](https://magicmirror.builders/) Module - A module for Magic Mirror that displays the current playing song on a machine that exposes the MPRIS2 interface by WebSocket (which is another script I've wrote)

![Screenshot][screenshot]

## Install
1. Clone repository into ``../modules/`` inside your MagicMirror folder.
2. Add the module to the Magic Mirror config.
```
{
  module: "MMM-MPRIS2-WebSocket",
  position: "top_left",
  header: "Playing now",
  config: {
    host : <host of target machine>,
    port : <port of target machine>
  }
},
```
3. Run [This script](https://github.com/buxxi/scripts/blob/master/mpris2_websocket.py) on your target machine, see below for autostart with systemd.
4. Done! Start playing a song with a MPRIS-capable player and it should show up.

## Configuration parameters
- ``host`` : The machine that has the info on which song is playing, required
- ``port`` : The port of the remote machine that is running the mpris2_websocket.py script, default is 9000
- ``retryInterval`` : How long in milliseconds it should wait before trying to make a new connection if the remote server isn't answering or the connection has been dropped, default is 5 minutes

## Systemd unit to have autostart of the server
1. Create a file ``mpris2websocket.service`` in ``~/.local/share/systemd/user`` and make it executable with the following:
```
[Unit]
Description=MPRIS2 Websocket Controller

[Service]
Environment=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
Type=simple
ExecStart=<absolute folder for script>/mpris2_websocket.py -n <netmask to allow>

[Install]
WantedBy=default.target
```
2. Reload units ``systemctl --user daemon-reload``
3. Enable it by running ``systemctl --user enable mpris2websocket.service``
4. Start it by running ``systemctl --user start mpris2websocket.service``

 [screenshot]: https://github.com/buxxi/MMM-MPRIS2-Websocket/blob/master/screenshot.png
