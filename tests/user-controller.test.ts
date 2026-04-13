// tests/api.spec.ts
import { test, expect } from '@playwright/test';
import {StatusCodes} from "http-status-codes";

let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    type User = {
        id: number;
        name: string;
        email: string;
        phone: string;
    }

    let createdUser: User;
    test.beforeEach(async ({request}) => {
        const createResponse = await request.post(`${baseURL}`);
        createdUser = await createResponse.json();
    })

    test('find user: should return a user by ID', async ({ request }) => {
        const searchResponse = await request.get(`${baseURL}/${createdUser.id}`);
        const foundUser = await searchResponse.json();
        expect(foundUser.id).toBe(createdUser.id);
        expect(foundUser.name).toBe(createdUser.name);
        expect(foundUser.email).toBe(createdUser.email)
        expect(foundUser.phone).toBe(createdUser.phone);

    });

    test('find user: should return 404 if user not found', async ({ request }) => {
        const response = await request.get(`${baseURL}/101`);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND);
        const json = await response.json();
        expect(json.message).toBe('User not found');
    });

    test('create user: should add a new user', async ({ request }) => {
        expect(createdUser.id).not.toBeUndefined();
        expect(createdUser.id).toBeGreaterThan(0);
        expect(createdUser.id).toBeLessThanOrEqual(100);
    });

    test('delete user: should delete a user by ID', async ({ request }) => {
        const response = await request.delete(`${baseURL}/${createdUser.id}`);
        const json: User[] = await response.json();
        expect(response.status()).toBe(StatusCodes.OK);
        expect(json[0].id).toBe(createdUser.id);
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        const response = await request.delete(`${baseURL}/${createdUser.id}`);
        expect(response.status()).toBe(StatusCodes.OK);
        const secondDeleteResponse = await request.delete(`${baseURL}/${createdUser.id}`);
        expect(secondDeleteResponse.status()).toBe(StatusCodes.NOT_FOUND);
        const json = await secondDeleteResponse.json();
        expect(json.message).toBe('User not found');
    });

});
