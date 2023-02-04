
//Log in page section

/* NAVLINKS */
const about_link = document.querySelector(".about-link");
const underline = document.querySelector(".underline");
const github_link = document.querySelector(".github-repo-link img");

about_link.addEventListener('mouseover', function(){
    underline.style.width = "120%";
});
about_link.addEventListener('mouseout', function(){
    underline.style.width = "0";
});

github_link.addEventListener('mouseover', function(){
    github_link.style.width = "37px";
    about_link.style.paddingLeft = "7px";
});
github_link.addEventListener('mouseout', function(){
    github_link.style.width = "35px";
    about_link.style.paddingLeft = "10px";
});

/* NAVLINKS END */

//Log in page section END

/*===========================================================================================================*/
/*===========================================================================================================*/