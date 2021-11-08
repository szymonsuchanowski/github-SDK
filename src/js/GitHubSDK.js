class GitHubSDK {
    constructor(usernameValue = null, tokenValue = null) {
        this._setProperty('username', usernameValue);
        this._setProperty('token', tokenValue);
        this.url = 'https://api.github.com/';
    }

    getUsername() {
        return this.username;
    }

    getToken() {
        return this.token;
    }

    async validateUser() {
        const response = await this._fetch('user', this._options());
        if (response.login === this.username) {
            return response;
        } else {
            throw new Error('Token is not connected with specified username!');
        }
        //return response;
        /*const promise = await this._fetch('user', this._options());
        if (promise.ok) {
            const response = await promise.json();
            if (response.login === this.username) {
                return promise.status;
            }
            throw new Error('Token is not connected with specified username!');
        } else if (promise.status === 401) {
            throw new Error('Unauthorized token!');
        }
        throw new Error(`Error! Status: ${promise.status}`);*/
    }

    async getUserInfo(username) {
        if (!username) {
            throw new Error('No username specified!');
        }
        return await this._fetch(`users/${username}`, this._options());
        /*if(username) {
            const promise = await this._fetch(`users/${username}`, this._options());
            if (promise.ok) 
        } else {
            throw new Error('No username specified!');
        }*/
    }

    async getUserRepos(username) {
        if(!username) {
            throw new Error('No username specified!');
        }
        return await this._fetch(`users/${username}/repos`, this._options());
    }

    async getRepoCommits(username, repoName) {
        if (!username || !repoName) {
            throw new Error('No username or repo name specified!');
        }
        return await this._fetch(`repos/${username}/${repoName}/commits`, this._options());
    }

    async getRepoReadme(username, repoName) {
        if (!username || !repoName) {
            throw new Error('No username or repo name specified!');
        }
        return await this._fetch(`repos/${username}/${repoName}/readme`);
    }

    async getUserFollowers(username) {
        if(!username) {
            throw new Error('No username specified!');
        }
        return await this._fetch(`users/${username}/followers`, this._options());
    }

    async getUserFollowing(username) {
        if(!username) {
            throw new Error('No username specified!');
        }
        return await this._fetch(`users/${username}/following`);
    }

    async getRepoEvents(username, repoName) {
        if (!username || !repoName) {
            throw new Error('No username or repo name specified!');
        }
        return await this._fetch(`repos/${username}/${repoName}/events`);
    }

    _setProperty(propertyName, propertyValue) {
        if (!propertyValue) {
            throw new Error(`No ${propertyName} specified!`);
        }
        this[propertyName] = propertyValue;
    }

    async _fetch(additionalPath, options) {
        const promise = await fetch(this.url + additionalPath, options);
        if (promise.ok) {
            return await promise.json();
        }
        throw new Error(promise.statusText);
    }

    /*async _fetch(additionalPath, options) {
        return await fetch(this.url + additionalPath, options);
    }*/

    _options() {
        return {
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `token ${this.token}`,
            },
        }
    }
}

export default GitHubSDK;