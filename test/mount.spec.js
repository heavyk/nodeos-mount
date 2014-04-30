/* jshint -W024 */    
/* jshint expr:true */
"use strict";

var chai = require("chai");
var expect = chai.expect;
var mount = require("../mount");

var path = require("path");
var fs = require("fs");
var util = require("util");
var Q = require("q");

var TMP_DIR = path.join(__dirname, "tmp"); 

describe("mount", function(){
    //Create the target directory for mounting
    before(function(){
        if(!fs.existsSync(TMP_DIR)){
            fs.mkdirSync(TMP_DIR); 
        }
    });

    //Delete it afterwards
    after(function(done){
        mount.umount(TMP_DIR, function(err){
            fs.rmdirSync(TMP_DIR);
            done();
        });
    });

    describe("#mount", function(){

        afterEach(function(done){
            mount.umount(TMP_DIR, function(){
                done();
            });
        });

        it("should mount tmpfs filesystem", function(done){
            mount.mount("tmpfs", TMP_DIR, "tmpfs", function(err){
                expect(err).to.be.not.ok;
                mount.umount(TMP_DIR, function(err){
                    done();
                });
            });
        });

        it("should fail gracefully on wrong parameters", function(){
            var p1 = "tmpfs";
            var p2 = TMP_DIR;
            var p3 = "tmpfs";
            var p4 = function(err){};

            //Should all fail
            expect(mount.mount.bind(mount, p1, p4)).to.throw(Error);
            expect(mount.mount.bind(mount, p1, p4, p2)).to.throw(Error);
        });

        it("should not mount on nonexisting target", function(done){
            mount.mount("tmpfs", "notexist", "tmpfs", function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal("2");
                done();
            });
        });

        it("should mount tmpfs", function(done){
            mount.mount("tmpfs", TMP_DIR, "tmpfs", function(err){
                expect(err).to.be.not.ok;
                done();
            }); 
        });

        it("should mount tmpfs with flags", function(done){
            mount.mount("tmpfs", TMP_DIR, "tmpfs", ["readonly"], function(err){
                expect(err).to.be.not.ok;
                done();
            });
        });

    });

    describe("#umount", function(){
        it("should umount mounting point", function(done){
            mount.mount("tmpfs", TMP_DIR, "tmpfs", function(err){
                expect(err).to.be.not.ok;

                mount.umount(TMP_DIR, function(err){
                    expect(err).to.be.not.ok;
                    done();
                });
            });
        });

        it("should raise error on umounting a nonexisting mountpoint", function(done){
            mount.umount("nonexistent", function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal("2");
                done();
            });
        });
    });
});
