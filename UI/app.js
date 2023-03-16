Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:8888/classify_image";
        $("#resultHolder0").hide();
        $("#divClassTable0").hide(); 
        $("#resultHolder1").hide();            
        $("#divClassTable1").hide();
        $("#resultHolder2").hide();               
        $("#divClassTable2").hide();
        $.post(url, {
            image_data: imageData
        },function(data, status) {
            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder0").hide();
                $("#divClassTable0").hide(); 
                $("#resultHolder1").hide();             
                $("#divClassTable1").hide();
                $("#resultHolder2").hide();              
                $("#divClassTable2").hide();           
                $("#error").show();
                return;
            }
            let musicians = ["chuck_berry", "eminem", "justin_bieber", "madonna", "whitney_houston"];
            let maxScoreForThisClass = [];
            let match = [];
            let bestScore = -1;
            if(data.length > 3){
                data = data.slice(0, 3);
            }
            console.log(data)
            for (let i=0;i<data.length;++i) {
                maxScoreForThisClass.push(Math.max(...data[i].class_probability));
                if(maxScoreForThisClass[i]>bestScore) {
                    match.push(data[i]);
                    bestScore = maxScoreForThisClass[i];
                }
            }
            if (match.length != 0) {
                let ct = []
                console.log(ct);
                for(let el=0;el<match.length;el++){
                    ct.push(document.getElementById("classTable"+el));
                    if(match[el].class == 'chuck_berry'){
                        ct[el].className = "ct_cb";
                    } else if (match[el].class == 'eminem') {
                        ct[el].className = "ct_em";
                    } else if (match[el].class == 'justin_bieber') {
                        ct[el].className = "ct_jb";
                    } else if (match[el].class == 'madonna') {
                        ct[el].className = "ct_ma";
                    } else {
                        ct[el].className = "ct_wh";
                    }
                    $("#error").hide();
                    $("#resultHolder"+el).show();
                    $("#divClassTable"+el).show();
                    $("#resultHolder"+el).html($(`[data-player="${match[el].class}"`).html());
                    let classDictionary = match[el].class_dictionary;
                    for(let personName in classDictionary) {
                        let index = classDictionary[personName];
                        let probabilityScore = match[el].class_probability[index];
                        let elementName = "#score_" + personName + "_" + el;
                        $(elementName).html(probabilityScore);
                    }
                }
            }           
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();
        ct.classList.remove("ct_jb");	
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder0").hide();
    $("#divClassTable0").hide();
    $("#resultHolder1").hide();
    $("#divClassTable1").hide();
    $("#resultHolder2").hide();
    $("#divClassTable2").hide();

    init();
});