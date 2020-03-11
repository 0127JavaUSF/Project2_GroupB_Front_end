import { Component, OnInit } from '@angular/core';
import { TemplateService } from 'src/app/services/template.service';
import { SharedService } from 'src/app/services/shared.service';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/models/application';
import { Template } from 'src/app/models/template';
import { ApplicationAnswer } from 'src/app/models/application-answer';
import { TemplateQuestion } from 'src/app/models/template-question';

@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.css']
})
export class CreateApplicationComponent implements OnInit {

  firstName: string = "";
  lastName: string = "";
  address: string = "";
  city: string = "";
  state: string = "";
  zip: string = "";
  phone: string = "";
  email: string = "";

  template: any = null;
  answers: string[] = [];

  constructor(
    private appService: ApplicationService,
    private shared: SharedService,
    private templateService: TemplateService
    ) { }

  ngOnInit() {

    //get call for application questions
    this.templateService.getTemplate(this.shared.newListingId).subscribe( (data: any) => {
      this.template = data;

      //create answers array
      this.answers = [];
      for(let q of this.template.questions) {
        this.answers.push("");
      }
    }, error => {
      const test = 0;
    });
  }

  onSubmit() {

    //create application
    let app = new Application();

    app.firstName = this.firstName;
    app.lastName = this.lastName;
    app.email = this.email;
    app.phone = this.phone;
    app.address = this.address;
    app.city = this.city;
    app.state = this.state;
    app.zipCode = this.zip;

    app.template = new Template();
    app.template.id = this.template.id;

    app.answers = [];
    let i = 0;
    for(let a of this.answers) {

      let aa = new ApplicationAnswer();
      aa.answer = a;

      let q = new TemplateQuestion();
      q.id = this.template.questions[i].id;
      aa.question = q;

      app.answers.push(aa);

      i++;
    }

    //create in database
    this.appService.createApplication(app).subscribe( (data: any) => {
    }, error => {
      const test = 0;
    });
  }
}
