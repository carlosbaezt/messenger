import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    public user: User;
    imageChangedEvent: any = '';
    croppedImage: any = '';

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private firebaseStorage: AngularFireStorage
    ) {
        this.authenticationService.getStatus().subscribe(
            (data) => {
                this.userService.getUserById(data.uid).valueChanges().subscribe(
                    (user: User) => {
                        this.user = user;
                    }, (errorUser) => {
                        console.log(errorUser);
                    }
                );
            }, (error) =>{
                console.log(error);
            }
        );
    }

    ngOnInit() {
    }

    saveSettings() {
        if(this.croppedImage)
        {
            const avatarRoute = 'pictures/' + this.user.uid + '.jpg';
            this.firebaseStorage.ref(avatarRoute).putString(this.croppedImage, 'data_url').then(
                (data) => {
                    this.firebaseStorage.ref(avatarRoute).getDownloadURL().subscribe(
                        (url) => {
                            this.userService.setAvatar(url, this.user.uid).then(
                                () =>  {
                                    alert('Avatar uploaded succesful');
                                }
                            ).catch(
                                (errorSetAvatar) => {
                                    alert('Error uploading Avatar');
                                    console.log(errorSetAvatar);
                                }
                            );
                        },
                        (errorUrl) => {
                            console.log(errorUrl);
                        }
                    );
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        }


        this.userService.updateUser(this.user).then( (data) =>{
            alert('Save');
        }).catch( (error) => {
            alert('Error');
            console.log(error);
        });
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }
}