
window.addEventListener("resize", onresize);
var currentMode = ""; // accordions | list | tabbed -> this variable to store which the current screen is
var currentTab = -1; // 0 | 1 | 2 -> this variable is used for Tabbed to identify which the current tab is

/* event */
function onresize(){
	refresh(); // refresh after any window size changed
}

function onload(){
	refresh(); // refresh after onload
}

// this event is fired when the heading h2 is clicked
function onSubHeadingClick(index){
	
	var liList = document.getElementsByTagName('li');
	var parent = liList[index];
	if (currentMode == "accordions"){				
		var plusIcon = parent.getElementsByTagName('span')[0];
		var paragraph = parent.getElementsByTagName('p')[0];
		
		if (plusIcon.innerHTML =='+'){
			plusIcon.innerHTML = '-';
			show(paragraph);		
			parent.setAttribute('activeTime', toUnixTime(new Date())); // store now() to activeTime whenever the heading is expanded
		}
		else{
			plusIcon.innerHTML = '+';			
			hide(paragraph);
			parent.setAttribute('activeTime', 0); // set to 0 because this heading is collapsed
		}
	} else if (currentMode =='tabbed')
	{		
		// collapse all tabs
		for (i = 0; i < liList.length; i++) { 
			setInActiveTab(i);
			var plusIcon = liList[i].getElementsByTagName('span')[0];
			var paragraph = liList[i].getElementsByTagName('p')[0];
			
			plusIcon.innerHTML = '+';
			hide(paragraph);			
			liList[i].setAttribute('activeTime', 0); // set to 0 because this heading is collapsed
		}		
		
		// then active the clicked tab
		setActiveTab(index); 
		parent.setAttribute('activeTime', toUnixTime(new Date())); // store now() to activeTime whenever the heading is expanded
		currentTab = index; // set the currentTab
	}
}

/* custom function */

// refresh the state
function refresh(){
	getCurrentDisplay(); // identifies which screen is currently open
	setVisible(); // set visibility state for all elements based on the current screen
}

// show a paragraph
function show(paragraph){
	paragraph.className = '';
}

// hide a paragraph
function hide(paragraph){
	paragraph.className = 'hide'; // changes the className and triggers the CSS transition
}

// set visibility state for all elements based on the current screen
function setVisible(){
	var liList = document.getElementsByTagName('li');		
	if (currentMode == "list"){
		// in list mode, all headings will show
		for (i = 0; i < liList.length; i++) { 
			ali = liList[i];			
			paragraph = ali.getElementsByTagName('p')[0];
			show(paragraph);		
			setInActiveTab(i); // in list mode, there is no active tab -> set inactive all tab
		}
	} else if (currentMode == "accordions"){
		for (i = 0; i < liList.length; i++) { 
			ali = liList[i];			
			plusIcon = ali.getElementsByTagName('span')[0];
			paragraph = ali.getElementsByTagName('p')[0];
			// span - -> the heading is currently expanded
			// or Expand the heading which is currently expanded in the Tab mode
			if (plusIcon.innerHTML =='-' || currentTab == i){				
				show(paragraph);
				plusIcon.innerHTML = '-';				
			}
			// span + -> the heading is currently collapsed
			else{
				hide(paragraph);				
				plusIcon.innerHTML = '+';
			}
			setInActiveTab(i); // in accordions mode, there is no active tab -> set inactive all tab 
		}		
	} else if (currentMode == "tabbed"){
		var maxActiveTime = 0;
		var currentIndex = 0;
		// identify which is the most recent expanded heading from the accordions mode by comparing activeTime. The found heading index will be stored in currentIndex variable
		for (i = 0; i < liList.length; i++) { 
			ali = liList[i];
			paragraph = ali.getElementsByTagName('p')[0];			
			hide(paragraph);
			activeTime = ali.getAttribute('activeTime');
			
			if (activeTime > maxActiveTime){
				maxActiveTime = activeTime;
				recentContent = paragraph.innerHTML;
				currentIndex= i;
			}
		}
		if (maxActiveTime == 0){
			currentIndex = 0;
		}
		
		//currentTab = currentIndex;
		// after the most recent expanded heading is found, set active tab for that heading
		setActiveTab(currentIndex);
	}
}

// set style for inactive tab
function setInActiveTab(index){
	var liList = document.getElementsByTagName('li');		
	liList[index].getElementsByTagName('h2')[0].style.backgroundColor='white';
	liList[index].getElementsByTagName('h2')[0].style.color='black';
}

// set style & content for active tab
function setActiveTab(index){
	// set active style
	var liList = document.getElementsByTagName('li');	
	liList[index].getElementsByTagName('h2')[0].style.backgroundColor='black';
	liList[index].getElementsByTagName('h2')[0].style.color='white';
	// set recent content
	recentContent = liList[index].getElementsByTagName('p')[0].innerHTML;
	var activeContent = document.getElementById('activeContent');
	activeContent.innerHTML = recentContent;
}

// this method will look at the #type css to identify which current screen is. The current screen value will be stored in currentMode variable
function getCurrentDisplay(){ 
	var element = document.getElementById('type');
    style = window.getComputedStyle(element);
    type = style.getPropertyValue('width');
	if (type == '1px') // width = 1 -> accordions
		currentMode = "accordions";
	else if (type == '2px') // width = 2 -> list
		currentMode = "list"
	else // width = 3 -> tabed
		currentMode = "tabbed";
}

// convert a date to Unix Timestamp
function toUnixTime(date){
	return (date.getTime() / 1000).toFixed(0)
}

