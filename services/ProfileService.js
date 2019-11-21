const uuid = require('uuid/v4');

export class Profile {
    constructor() {
        this.username = ''
        this.email = ''
        this.notifyUpdate = true
        this.notifyFollow = true
        this.notifyNearby = true
        this.following = []
    }
}

export class ProfileService {

    static create = profile => {
        profile.id = uuid()
        profile.created = new Date().getTime()
        console.log('ProfileService.create: ' + JSON.stringify(profile))
        return profile
    }

    static update = profile => {
        profile.updated = new Date().getTime()
        console.log('ProfileService.update: ' + JSON.stringify(profile))
        return profile
    }

    static delete = profile => {
        profile.isDeleted = true
        console.log('ProfileService.delete: ' + JSON.stringify(profile))
        return ProfileService.update(report)
    }

}