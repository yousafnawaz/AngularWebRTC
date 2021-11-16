import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Peer from 'peerjs';


@Component({
  selector: 'app-peer',
  templateUrl: './peer.component.html',
  styleUrls: ['./peer.component.scss']
})
export class PeerComponent implements OnInit {

  constructor() { }
  peer: Peer = new Peer();
  peerId: string = "";
  connectId: string = "";


  @ViewChild("screenStream") video!:ElementRef<HTMLVideoElement>;
  ngOnInit(): void {
    this.peer.on('open', (id) => {
      this.peerId = id;
      console.log(this.peerId)
      //this.createURLToConnect(id);
    });
    this.receiveListener();
  }
  connect() {
    const conn = this.peer.connect(this.connectId);
    conn.on('open', () => {
      conn.send('hi!');
    });
  }
  receiveListener() {
    this.peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        // Will print 'hi!'
        console.log(data);
      });
      conn.on('open', () => {
        conn.send('hello!');
      });
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
       // this.lazyStream = stream;

        call.answer(stream);
        call.on('stream', (remoteStream) => {
          //if (!this.peerList.includes(call.peer)) {
            this.streamVideo(remoteStream);
           // this.currentPeer = call.peerConnection;
          //  this.peerList.push(call.peer);
         // }
        });

      }).catch(err => {
        console.log(err + 'Unable to get media');
      });
    });
  }

  call(){
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
      const call = this.peer.call(this.connectId, stream);
      call.on('stream', (remoteStream) => {
        // Show stream in some <video> element.
        this.streamVideo(remoteStream);
      });
    }, (err) => {
      console.error('Failed to get local stream', err);
    });
  }
  streamVideo(remoteStream: MediaStream) {
    const _video = this.video.nativeElement;
    _video.srcObject = remoteStream;
    _video.play(); 
  }



}
