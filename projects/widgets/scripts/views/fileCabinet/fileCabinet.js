function fileCabinet(){
    fileCabinet.base.call(this);
    this.mutuallyExclusive();
}
fileCabinet.prototype = { }
$.ext(fileCabinet, $.toggleset.Class);
$.fileCabinet = function(){ return new fileCabinet(); }