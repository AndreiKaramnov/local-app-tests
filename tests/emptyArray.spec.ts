import {test, expect, request} from '@playwright/test';

let baseURL: string = 'http://localhost:3000/users';

test.describe("Empty users array scenario", () => {
    type User = {
        id: number;
        name: string;
        email: string;
        phone: string;
    }
    test.beforeEach(async ({request}) => {
        const response = await request.get(`${baseURL}`);
        const users: User[] = await response.json();
        for (let i = 0; i < users.length; i++) {
            await request.delete(`${baseURL}/${users[i].id}`);
        }
    })
    test("all users should return empty array when nj users", async ({request}) => {
        const afterDeleteResponse = await request.get(`${baseURL}`);
        const afterDeleteResponseJson = await afterDeleteResponse.json();
        expect(afterDeleteResponseJson.length).toBe(0);
        expect(afterDeleteResponseJson).toBeInstanceOf(Array);
    })
})