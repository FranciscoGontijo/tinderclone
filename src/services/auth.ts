export type UserType = {
    token: string;
    user: {
        name: string;
        email: string;
    }
};

export const signIn = (): Promise<UserType> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                token: 'jk12h3j21h3jk212h3jk12h3jkh12j3kh12k123hh21g3f12f3',
                user: {
                    name: 'Francisco',
                    email: 'testemail@example.com',
                },
            });
        }, 2000);
    });
};