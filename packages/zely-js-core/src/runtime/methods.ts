import { methods } from '../server/controller/methods';

const { all, post, get, put } = methods;

export const ALL = all;
export const POST = post;
export const GET = get;
export const PUT = put;
export const DELETE = methods.delete;

export const { middleware } = methods;
