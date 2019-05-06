import {  ElementRef, ViewChild, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { Message } from '../interfaces/message';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';


@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
    friend: User;
    user: User;
    conversation_id: any;
    textMessage: string;
    conversation: any;
    shake = false;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;


    constructor(
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private conversationService: ConversationService,
        private authenticationService: AuthenticationService

    ) { }

    ngOnInit() {
        const friendId = this.activatedRoute.snapshot.params['uid'];

        this.authenticationService.getStatus().subscribe(
            (data) => {
                this.userService.getUserById(data.uid).valueChanges().subscribe(
                    (user: User) => {
                        this.user = user;
                        this.userService.getUserById(friendId).valueChanges().subscribe(
                            (userFriend: User) => {
                                console.log(userFriend);
                                this.friend = userFriend;
                                const ids = [ this.user.uid, this.friend.uid ].sort();
                                this.conversation_id = ids.join('|');
                                this.getConversation();
                            },
                            (errorFriend) => {
                                console.log(errorFriend);
                            }
                        );
                    }, (errorUser) => {
                        console.log(errorUser);
                    }
                );
            }, (error) => {
                console.log(error);
            }
        );
    }

    sendMessage() {
        const message: Message =  {
            uid: this.conversation_id,
            text: this.textMessage,
            timestamp: Date.now(),
            sender: this.user.uid,
            receiver: this.friend.uid,
            type: 'text'
        }

        this.conversationService.createConversation(message).then(
            (data) => {
                this.textMessage = '';
            }
        );
    }

    getConversation() {
        this.conversationService.getConversation(this.conversation_id).valueChanges().subscribe(
            (data: Message[]) =>  {
                this.conversation = data.filter( (messages) => messages.type != 'zumbido' );
                this.conversation.forEach((message) => {
                    if (!message.seen) {
                        message.seen = true;
                        this.conversationService.editConversation(message);
                        if(message.type === 'text')
                        {
                            const audio = new Audio('assets/sound/new_message.m4a');
                            audio.play();
                        } else if(message.type === 'zumbido' ) {
                            this.doZumbido();
                        }
                    }
                });
                console.log(this.conversation);
                this.scroll(this.myScrollContainer.nativeElement);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getUserNickById(id: any) {
        if(this.friend.uid == id) {
            return this.friend.nick;
        }
        return this.user.nick;
    }

    sendZumbido() {
        const message = {
            uid: this.conversation_id,
            text: null,
            timestamp: Date.now(),
            sender: this.user.uid,
            receiver: this.friend.uid,
            type: 'zumbido'
        }

        this.conversationService.createConversation(message).then( (data) => { } );
        this.doZumbido();
    }

    doZumbido() {
        const audio = new Audio('assets/sound/zumbido.m4a');
        audio.play();
        this.shake = true;
        window.setTimeout(() => {
            this.shake = false;
        }, 1000);
    }


    scroll(el: HTMLElement) {
        const node = el;

        // scroll to your element
        node.scrollIntoView(true);

        // now account for fixed header
        const scrolledY = el.scrollWidth;

        console.log(el.scrollHeight);
        el.scrollTop = 200;
    }
}
