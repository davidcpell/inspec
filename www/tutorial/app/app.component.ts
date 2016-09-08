import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HTTP_PROVIDERS } from '@angular/http';
import { XtermTerminalComponent } from './xterm-terminal/xterm-terminal.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [ HTTP_PROVIDERS ],
  directives: [ XtermTerminalComponent ]
})

export class AppComponent implements OnInit {
  instructions: any;
  counter: number = 0;
  response: string;
  shell: string;
  red: string = " [31m";
  white: string = " [37m";
  black: string = " [30m";
  commandsJson: any;
  instructionsJson: any;


  constructor(private http: Http) { }

  ngOnInit() {
    this.getInstructions();
    this.getResponses();
  }

  updateInstructions(step) {
    // let totalSteps = this.instructionsArray.length - 1;
    let totalSteps = 20;
    let msg = Math.random();
    if (step === 'next') {
      if (this.counter < totalSteps) {
        this.counter += 1;
      }
      this.response = this.black + 'Message: ' + msg;

    } else if (step === 'prev') {
      if (this.counter > 0) {
        this.counter -= 1;
      }
      this.response = this.black + 'Message: ' + msg;
    }
    debugger;
    this.instructions = this.displayInstructions();
  }

  displayInstructions() {
    if (this.instructionsJson[this.counter][1]) {
      return this.instructionsJson[this.counter][1];
    } else {
      return ''
    }
  }

  evalCommand(command) {
    if (this.shell === 'inspec-shell') {
      this.parseInspecShell(command);
    }
    else if (command.match(/^inspec\s*.*/)) {
      this.parseInspecCommand(command);
    }
    else if (command.match(/^next\s*/)) {
      this.updateInstructions('next');
    }
    else if (command.match(/^prev\s*/)) {
      this.updateInstructions('prev');
    }
    else if (command.match(/^ls\s*/)) {
      this.response = this.white + "README.md";
    }
    else if (command.match(/^pwd\s*/)) {
      this.response = this.white + "anonymous-web-user/inspec";
    }
    else if (command.match(/^cat\s*README.md\s*/i)) {
      this.response = this.white + "Only a few commands are implemented in this terminal.  Please follow the demo";
    }
    else if (command.match(/^less\s*README.md\s*/i)) {
      this.response = this.white + "Only a few commands are implemented in this terminal.  Please follow the demo.";
    }
    else {
      this.response = this.white + "invalid command: " + command;
    }
  }

  parseInspecCommand(command) {
    let command_target = command.match(/^inspec\s*(.*)/);
    console.log(command, command_target);
    if (command_target[1] === 'shell') {
      this.shell = 'inspec-shell'
      // this.response = this.white + this.responsesArray[12]['_body'];;
    }
    else if (command_target[1].match(/^shell\s*-c.*/)) {
      this.parseShellCommand(command);
    }
    else if (command_target[1].match(/^exec\s*.*/)) {
      this.parseInspecExec(command);
    }
    else if (command_target[1].match(/^help\s*.*/)) {
      this.parseInspecHelp(command);
    }
    else if (command_target[1].match(/^check\s*examples\/profile\s*/)) {
      // this.response = this.white + this.responsesArray[0]['_body'];
    }
    else if (command_target[1].match(/^detect\s*$/)) {
      // this.response = this.white + this.responsesArray[1]['_body'];
    }
    // else if (command_target[1].match(/^detect\s*-t\s*ssh:\/\/bob@host.node\s*-i\s*bob.rsa\s*/)) {
    //   this.response = this.white + this.responsesArray[16]['_body'];
    // }
    else if (command_target[1].match(/^version\s*/)) {
      // this.response = this.white + this.responsesArray[9]['_body'];
    }
    else {
      this.defaultResponse();
    }
  }
  // TODO:
  // add inspec detect --format json
  // inspec exec examples/profile --format json
  // inspec json examples/profile

  parseShellCommand(command) {
    let target = command.match(/^inspec\s*shell\s*-c\s*(.*)/)
    console.log(command, target);
    if (target[1].match(/^.os.params.\s*$/)) {
      // this.response = this.white + this.responsesArray[7]['_body'];
    }
    // else if (target[1].match(/^.os.params.\s*-t\s*docker:\/\/abcdef123\s*/)) {
    //   this.response = this.white + this.responsesArray[17]['_body'];
    // }
    else if (target[1].match(/^.sshd_config.Protocol.\s*$/)) {
      // TODO: change this response to correct one
      // this.response = this.white + this.responsesArray[8]['_body'];
    }
    // else if (target[1].match(/^.sshd_config.Protocol.\s*-t\s*ssh:\/\/bob@host.node\s*-i\s*bob.rsa\s*/)) {
    //   // TODO: change this response to correct one
    //   this.response = this.white + this.responsesArray[8]['_body'];
    // }
    else {
      this.defaultResponse();
    }
  }

  defaultResponse() {
    let msg = Math.random();
    // this.response = this.white + this.responsesArray[3]['_body'] + this.black + msg;
  }

  parseInspecHelp(command) {
    let target = command.match(/^inspec help\s*(.*)/);
    if (target[1] === 'detect') {
      // this.response = this.white + this.responsesArray[4]['_body'];
    }
    else if (target[1] === 'exec') {
      // this.response = this.white + this.responsesArray[5]['_body'];
    }
    else if (target[1] === 'version') {
      // this.response = this.white + this.responsesArray[6]['_body'];
    }
    else {
      this.defaultResponse();
    }
  }

  parseInspecExec(command) {
    let target = command.match(/^inspec exec\s*(.*)/);
    if (target[1] === 'examples/profile') {
      // this.response = this.white + this.responsesArray[2]['_body'];
    }
    // else if (target[1].match(/^examples\/profile\s*-t\s*ssh:\/\/bob@host.node\s*-i\s*bob.rsa\s*/)) {
    //   this.response = this.white + this.responsesArray[14]['_body'];
    // }
    // else if (target[1].match(/^examples\/profile\s*-b\s*ssh\s*--host\s*host.node\s*--user\s*bob\s*-i\s*bob.rsa\s*/)) {
    //   this.response = this.white + this.responsesArray[14]['_body'];
    // }
    // else if (target[1].match(/^examples\/profile\s*-t\s*winrm:\/\/alice:pass@windows.node\s*$/)) {
      // this.response = this.white + this.responsesArray[13]['_body'];
    // }
    // else if (target[1].match(/^examples\/profile\s*-t\s*winrm:\/\/alice:pass@windows.node\s*--ssl\s*--self-signed\s*/)) {
    //   this.response = this.white + this.responsesArray[13]['_body'];
    // }
    // else if (target[1].match(/^examples\/profile\s*-t\s*docker:\/\/abcdef123\s*/)) {
    //   this.response = this.white + this.responsesArray[15]['_body'];
    // }
    else {
      this.response = this.red + "Could not fetch inspec profile in '" + target[1] + "' ";
    }
  }

  parseInspecShell(command) {
    if (command.match(/^exit\s*/))  {
      this.shell = '';
      this.response = '';
    }
    else if (command.match(/^ls\s*/)) {
      this.response = this.white + "anonymous-web-user/inspec-shell";
    }
    // TODO: add inspec shell commands
    else {
      this.response = this.white + 'soon this will work, but not yet :) '
    }
  }

  getInstructions() {
    this.http.get('instructions.json')
      .subscribe(data => {
        this.instructionsJson = data['_body']
      },
    // .subscribe(
    //   data => {
    //     this.instructionsJson = data.map(res => res['_body'])
    //   },
      err => console.error(err)
    );
  }

  getResponses() {
    Observable.forkJoin(
      this.http.get('commands.json')
    ).subscribe(
      data => {
        this.commandsJson = data;
      },
      err => console.error(err)
    );
  }
}
