import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HTTP_PROVIDERS } from '@angular/http';
import { XtermTerminalComponent } from './xterm-terminal/xterm-terminal.component';
declare var require: any;
var shellwords = require("shellwords");

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
  commandsArray: any = [];
  instructionsArray: any = [];
  matchFound: boolean;

  constructor(private http: Http) { }

  ngOnInit() {
    this.getInstructions();
    this.getResponses();
  }

  updateInstructions(step) {
    let totalSteps = this.instructionsArray.length - 1;
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
    this.instructions = this.displayInstructions();
  }

  displayInstructions() {
    if (this.instructionsArray[this.counter][1]) {
      let title = this.instructionsArray[this.counter][0];
      let text = this.instructionsArray[this.counter][1];
      let noBackticks = text.replace(/```/g, '');
      let formattedText = noBackticks.replace(/[\r\n]+/g, '\n');
      return title + "\n" + formattedText;
    } else {
      return 'Sorry, something seems to have gone wrong. Please try refreshing your browser.'
    }
  }

  evalCommand(command) {
    if (command.match(/^next\s*/)) {
      this.updateInstructions('next');
    }
    else if (command.match(/^prev\s*/)) {
      this.updateInstructions('prev');
    }
    else if (this.shell === 'inspec-shell') {
      this.parseInspecShell(command);
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
      this.checkCommand(command);
    }
  }

  parseInspecShell(command) {
    if (command.match(/^exit\s*/))  {
      this.shell = '';
      this.response = '';
    }
    else {
      let escaped_cmd = shellwords.escape(command)
      let regex_compatible = escaped_cmd.replace(/\W/g, '.*');
      let formatted_cmd = 'echo ' + regex_compatible + ' . inspec shell';
      this.checkCommand(formatted_cmd);
    }
  }

  checkCommand(command) {
    let dir = 'app/responses/';
    let cmd = command.replace(/ /g,"\\s*")
    let regexcmd = new RegExp(('^'+cmd+'\\s*$'))
    this.matchFound = false;
    for (var i = 0; i < this.commandsArray.length; i++) {
      let object = this.commandsArray[i]
      for (let key in object) {
        if (key.match(regexcmd)) {
          this.matchFound = true;
          let value = object[key];
          this.http.get(dir + value).subscribe(data => {
            this.displayResult(command, data);
          },
          err => console.error(err));
        }
      }
    }
    if (this.matchFound === false) {
      let msg = Math.random();
      if (command.match(/^inspec exec\s*.*/)) {
        let target = command.match(/^inspec exec\s*(.*)/)
        this.response = this.red + "Could not fetch inspec profile in '" + target[1] + "' ";
      } else {
        this.response = this.red + 'invalid command: ' + command + this.black + msg;
      }
    }
  }

  displayResult(command, data) {
    if (command.match(/^inspec\s*shell\s*$/)) {
      this.shell = 'inspec-shell';
    }
    let msg = Math.random();
    this.response = this.white + data['_body'] + this.black + msg;
  }

  getInstructions() {
    this.http.get('instructions.json')
      .subscribe(data => {
        this.instructionsArray = JSON.parse(data['_body']);
        this.instructions = this.displayInstructions();
      },
      err => console.error(err)
    );
  }

  getResponses() {
    this.http.get('commands.json')
      .subscribe(data => {
        let result = JSON.parse(data['_body']);
        let files = [];
        for (var i = 0; i < result.length; i++) {
          let object = result[i][0];
          this.commandsArray.push(object);
        }
      },
      err => console.error(err)
    );
  }
}