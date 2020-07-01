import { Component, OnInit } from '@angular/core';
import { MyComponentsModule } from './../../components/components.module';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
