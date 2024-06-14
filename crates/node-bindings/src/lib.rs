#![deny(clippy::all)]
 
#[macro_use]
extern crate napi_derive;

#[napi]
fn sum(a: u32, b: u32) -> u32 {
	a + b
}