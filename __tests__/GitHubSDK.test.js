import nodeFetch from 'node-fetch';
global.fetch = nodeFetch;
import GitHubSDK from '../src/js/GitHubSDK';
import user from '../src/js/user.config';

describe('GitHubSDK class', () => {
    describe('Create instance', () => {
        it('Should throw exception when username is not specified', () => {
            function createGhSDK() {
                new GitHubSDK(undefined, 'xxxx');
            };
            expect(createGhSDK).toThrow('No username specified!');
        });

        it('Should throw exception when token is not specified', () => {
            function createGhSDK() {
                new GitHubSDK('xxxxx');
            };
            expect(createGhSDK).toThrow('No token specified!');
        });

        it('Should throw exception when token & username are not specified', () => {
            function createGhSDK() {
                new GitHubSDK();
            };
            expect(createGhSDK).toThrow();
        });

        it('Should set username & token when create instance', () => {
            const username = 'xxxxx';
            const token = '12345678';
            const ghSDK = new GitHubSDK(username, token);
            expect(ghSDK.getUsername()).toBe(username);
            expect(ghSDK.getToken()).toBe(token);
        });
    });

    describe('validateUser()', () => {
        it('Should throw exception when token is incorrect', async () => {
            const username = 'szymonsuchanowski';
            const token = 'invalidtoken';
            const ghSDK = new GitHubSDK(username, token);
            await expect(ghSDK.validateUser()).rejects.toThrow('Unauthorized');
        });

        it('Should throw exception when token is correct but not connected with specifiedd username', async () => {
            const username = 'usernamenotconnectedwithtoken';
            const token = user.token;
            const ghSDK = new GitHubSDK(username, token);
            await expect(ghSDK.validateUser()).rejects.toThrow('Token is not connected with specified username!');
        });

        it('Should return user login when token is correct & connected with specified username', async () => {
            const username = user.username;
            const token = user.token;
            const ghSDK = new GitHubSDK(username, token);
            const { login } = await ghSDK.validateUser();
            expect(login).toBe(user.username);
        });
    });

    describe('getUserInfo(username)', () => {
        it('Should throw exception when username is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getUserInfo()).rejects.toThrow('No username specified!');
        });

        it('Should throw exception when specified username is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getUserInfo('///user--do-not-exist////')).rejects.toThrow('Not Found');
        });

        it('Should return user login when correct username is specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const { login } = await ghSDK.getUserInfo('devmentor-pl');
            expect(login).toBe('devmentor-pl');
        });
    });

    describe('getUserRepos(username)', () => {
        it('Should throw exception when username is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getUserRepos()).rejects.toThrow('No username specified!');
        });

        it('Should throw exception when specified username is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getUserRepos('///use---r--do-not-exist////')).rejects.toThrow('Not Found');
        });

        it('Should return repos list when username is correct', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const result = await ghSDK.getUserRepos('devmentor-pl');
            expect(Array.isArray(result)).toBeTruthy();
        });
    });

    describe('getRepoCommits(username, repoName)', () => {
        it('Should throw exception when username & repo name is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoCommits()).rejects.toThrow('No username or repo name specified!');
        })

        it('Should throw exception when username is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoCommits(undefined, 'practice-js-testing')).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when repo name is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoCommits('szymonsuchanowski')).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when specified username is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoCommits('///use---r--does-not-exist////', 'xxx')).rejects.toThrow('Not Found');
        });

        it('Should throw exception when specified repo name is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoCommits('szymonsuchanowski', 'xxx')).rejects.toThrow('Not Found');
        });

        it('Should return commits list when username & repo name are correct', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const result = await ghSDK.getRepoCommits('devmentor-pl', 'practice-js-basics');
            expect(Array.isArray(result)).toBeTruthy();
        });
    });

    describe('getRepoReadme(username, repoName)', () => {
        it('Should throw exception when username & repo name is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoReadme()).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when username is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoReadme(undefined, 'practice-js-testing')).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when repo name is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoReadme('szymonsuchanowski')).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when specified username is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoReadme('///use---r--does-not-exist////', 'xxx')).rejects.toThrow('Not Found');
        });

        it('Should throw exception when specified repo name is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoReadme('szymonsuchanowski', 'xxx')).rejects.toThrow('Not Found');
        });

        it('Should return readme info when username & repo name are correct', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const result = await ghSDK.getRepoReadme('devmentor-pl', 'practice-js-basics');
            expect(result.name).toBe('README.md');
        });
    });

    describe('getUserFollowers(username)', () => {
        it('Should throw exception when username is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getUserFollowers()).rejects.toThrow('No username specified!');
        });

        it('Should throw exception when username is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getUserFollowers('----user--does-not---exist//')).rejects.toThrow('Not Found');
        });

        it('Should return followers list when username is correct', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const result = await ghSDK.getUserFollowers('szymonsuchanowski');
            expect(Array.isArray(result)).toBeTruthy();
        });
    });

    describe('getUserFollowing(username)', () => {
        it('Should throw exception when username is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getUserFollowing()).rejects.toThrow('No username specified!');
        });

        it('Should throw exception when username is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getUserFollowing('----user--does-not---exist//')).rejects.toThrow('Not Found');
        });

        it('Should return list of following users when username is correct', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const result = await ghSDK.getUserFollowing('szymonsuchanowski');
            expect(Array.isArray(result)).toBeTruthy();
        });
    });

    describe('getRepoEvents(username, repoName)', () => {
        it('Should throw exception when username & repo name is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoEvents()).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when username is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoEvents(undefined, 'practice-js-testing')).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when repo name is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoEvents('szymonsuchanowski')).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when specified username is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoEvents('///use---r--does-not-exist////', 'xxx')).rejects.toThrow('Not Found');
        });

        it('Should throw exception when specified repo name is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.getRepoEvents('szymonsuchanowski', 'xxx')).rejects.toThrow('Not Found');
        });

        it('Should return repo events when username & repo name are correct', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const result = await ghSDK.getRepoEvents('devmentor-pl', 'practice-js-basics');
            expect(Array.isArray(result)).toBeTruthy();
        });
    });

    describe('createRepo(repoName)', () => {
        it('Should throw exception when repoName is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.createRepo()).rejects.toThrow('No repo name specified!');
        });
    });

    describe('deleteRepo(repoName)', () => {
        it('Should throw exception when repoName is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.deleteRepo()).rejects.toThrow('No repo name specified!');
        });

        it('Should throw exception when specified repoName does not exist', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.deleteRepo('-----repo---does-not-exist---/////')).rejects.toThrow('Not Found');
        });
    })

    describe('sendInvitation(invitedUser, repoName', () => {
        it('Should throw exception when invitedUser & repo name is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.sendInvitation()).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when invitedUser is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.sendInvitation(undefined, 'practice-js-testing')).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when repo name is not specified', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.sendInvitation('szymonsuchanowski')).rejects.toThrow('No username or repo name specified!');
        });

        it('Should throw exception when specified invitedUser is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.sendInvitation('///use---r--does-not-exist////', 'xxx')).rejects.toThrow('Not Found');
        });

        it('Should throw exception when specified repo name is incorrect', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.sendInvitation('szymonsuchanowski-test', '----repo--does---not-exi///st/////----')).rejects.toThrow('Not Found');
        });
    });

    describe('flow: create test repo -> try to create the same test repo -> send invitation to created test repo -> delete created test repo', () => {
        it('Should create test repo', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const reposBeforeCreating = await ghSDK.getUserRepos(user.username);
            const reposNoBeforeCreating = reposBeforeCreating.length;
            await ghSDK.createRepo('--new-test-repo--');
            const reposAfterCreating = await ghSDK.getUserRepos(user.username);
            const reposNoAfterCreating = reposAfterCreating.length;
            expect(reposNoAfterCreating).toBe(reposNoBeforeCreating + 1);
        });

        it('Should throw exception when trying to create repo with the same name', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            await expect(ghSDK.createRepo('--new-test-repo--')).rejects.toThrow('Unprocessable Entity');
        });

        it('Should send invitation for test user to created repo', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const invitedUser = 'szymonsuchanowski';
            const result = await ghSDK.sendInvitation(invitedUser, '--new-test-repo--');
            const { login } = result.invitee;
            expect(login).toBe(invitedUser);
        });

        it('Should delete created test repo', async () => {
            const ghSDK = new GitHubSDK(user.username, user.token);
            const reposBeforeDeleting = await ghSDK.getUserRepos(user.username);
            const reposNoBeforeDeleting = reposBeforeDeleting.length;
            await ghSDK.deleteRepo('--new-test-repo--');
            const reposAfterDeleting = await ghSDK.getUserRepos(user.username);
            const reposNoAfterDeleting = reposAfterDeleting.length;
            expect(reposNoAfterDeleting).toBe(reposNoBeforeDeleting - 1);
        });
    });
})


