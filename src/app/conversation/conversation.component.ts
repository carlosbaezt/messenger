import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';

@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
    friend: User;
    price = 17.123;
    today = Date.now();

    constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

    ngOnInit() {
        const friendId = this.activatedRoute.snapshot.params['uid'];
        this.friend = this.userService.getFriend(friendId);
        console.log(this.friend);
    }
}
