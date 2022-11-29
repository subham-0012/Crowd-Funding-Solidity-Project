const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
//const { interfaces } = require("mocha");

const provider = ganache.provider();// creating a instance of web3
const web3= new Web3(provider);// creating a instance of web3
const { interface, bytecode } = require("../compile"); // getting interface and bytecode from compile.js file


let accounts;
let inbox;

beforeEach(async () => {
  //getting list of accounts

  //web3.eth.getAccounts().then((fetchedAccounts) => {                       // making promise to the local server
  //console.log(fetchedAccounts);});

  //Asynchoronous
    accounts = await web3.eth.getAccounts();

  //deploying a contract.........
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ["Hi there!"] })
    .send({ from: accounts[0], gas: "1000000" });
    inbox.setProvider(provider);
});
describe("Inbox", () => {
    it("deploys a contract", () => {
    assert.ok(inbox.options.address);
    });
    it("has a default message",async() => {
        const message= await inbox.methods.message().call();
        assert.equal(message,"Hi there!");
    });
    it("can change the message",async()=>{
        await inbox.methods.setMessage("Bye").send({from : accounts[0]});
        const message=await inbox.methods.message().call();
        assert.equal(message,"Bye");
    })
});