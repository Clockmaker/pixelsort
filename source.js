"use strict"; 

function quicksort(array, compare_fn){
	function _quicksort(array, from, to, compare_fn){
		if (to - from > 0) {
		  for (var pivot = array[to], R = from, L=from; R < to; R++) {
			if (compare_fn(pivot, array[R])){
			  [array[R], array[L]] = [array[L], array[R]];
			  L++;
			}
		  }
		  [array[L], array[to]] = [array[to], array[L]];
		  _quicksort(array, from, L - 1, compare_fn);
		  _quicksort(array, L + 1, to, compare_fn);
		}
		return array;
	}
	return _quicksort(array, 0, array.length-1, compare_fn);
}

function lampsort(array, compare_fn){
	var queue = [0, array.length-1],
		pending = 1;
	var L, R, pivot, from, to;
	var rside;
	while(pending>0){
      from = queue[pending-1];
	  to = queue[pending];
      for (pivot = array[to], R = from, L = from; R < to; R++) {
        if ( compare_fn(pivot, array[R]) ){
          [array[R], array[L]] = [array[L], array[R]];
          L++;
        }
      }
      [array[L], array[to]] = [array[to], array[L]];

		rside = queue[pending] - (L+1) >0;

		if((L-1) - queue[pending-1] >0){
			if(rside) queue.push(L+1, queue[pending]);
			queue[pending]=L-1;
		}
		else if(rside) { queue[pending-1]=L+1; }
		else{ queue.pop(); queue.pop();}	
		pending = queue.length-1;
	}
return array;
}


function quicksort_dualpivot(array, compare_fn){
var queue = [0, array.length-1],
		pending = 1;
	var L, R, cur, pivot_min, pivot_maj, from, to;
	while(pending>0){
		from = queue[pending-1]; to = queue[pending];
		pivot_min = array[from]; pivot_maj = array[to];
		if(compare_fn(pivot_min, pivot_maj) ){
			[pivot_maj, pivot_min] = [pivot_min, pivot_maj];
			[array[from], array[to]] = [array[to], array[from]];
		}
		for(cur = L = from+1, R = to-1; cur <= R; cur++) {
			if( compare_fn(pivot_min, array[cur]) ){
				[array[cur], array[L]] = [array[L], array[cur]];
				L++;
			}else if( compare_fn(array[cur], pivot_maj) ){
				[array[cur], array[R]] = [array[R], array[cur]];
				R--; cur--;	
			}
		}
		L--; R++;
		[array[L], array[from]] = [array[from], array[L]];
		[array[R], array[to]] = [array[to], array[R]];
		queue.pop();queue.pop();
		if(L - from > 1) queue.push(from, L-1);
		if(R - L > 2) queue.push(L+1, R-1);
		if(to - R > 1) queue.push(R+1, to);
		pending = queue.length-1;
	}
return array;
}

function insertionsort(array, compare_fn){
	for(var i=0;i < array.length; i++){
		for(var copy=array[i], j=i; j>0 && compare_fn(array[j-1],copy); j--){
			array[j]=array[j-1];
		}
		array[j]=copy;
	}
return array;
}

function insertionsort_binary(array, compare_fn){
	var search, value, start, end, middle, moveto, depth;
	
	if(compare_fn(array[0], array[1])) [array[0],array[1]]=[array[1],array[0]];
	
	for(var sorted = 2; sorted < array.length; sorted++){
		value = array[sorted];
		start=0;
		end=sorted;
		while(end-start>1){
			middle= ~~((end+start)/2 );
			if(compare_fn(array[middle],value)){
				end=middle;
			}else{
				start=middle;
			}
		}
		if(start==0){
			if(compare_fn(array[0],value)) end = 0;
		}

		for(var j=sorted; j>end;j--){array[j]=array[j-1];} array[end]=value;	
	}
return array;
}


function insertionsort_binary2(array, compare_fn){
	var search, value, start, end, middle, moveto;
	for(var sorted = 1; sorted < array.length; sorted++){
		value = array[sorted];
		start=0;
		end=sorted;
		search=true;
		while(search){
		middle= ~~((end+start)/2 );
			if(compare_fn(array[middle],value)){
				end=middle;
				if(!compare_fn(array[middle-1], value)){//array[-1]=undefined=0
					moveto=middle;
					search=false;
				}
			}else{
				start=++middle;
				if(compare_fn(array[middle],value) || middle==sorted){
					moveto=middle;
					search=false;
				}
			}
		}
		for(var j=sorted; j>moveto;j--){array[j]=array[j-1];}
		array[moveto]=value;	
	}
return array;
}

/* 
 * Benchmarking/Testing
 * 
 */

function grid(size){
	var points= [];
	for(var x=0; x<size; x++)
		for(var y=0; y<size;y++)
			points.push([x,y]);
    return points;
}

function noise(count){
    var points = [];
	points[0] = [];
    for (let i = 0; i < count; i++) {
        points.push([Math.random() * 1e3, Math.random() * 1e3]);
    }
	return points;
}

function check_sort(array, sorted){
	var size = array.length-1;
	for(var i=0; i<size; i++) {
		if(array[i] !== sorted[i]){
			console.log('sorting error: element ['+i+'] '+array[i]+' != '+sorted[i]);
			console.log(array);
		return;
		}
	}
}

function benchmarksort(fn, compare_fn, unsorted, sorted=[]){
	console.log('Array size '+unsorted.length);
	
	var array, time;
	
	if(sorted.length == 0){
		sorted = unsorted.slice(0);
		time = performance.now();
		sorted.sort(compare_fn);
		console.log('Array.prototype.sort: '+(performance.now()-time)+" ms");
	}	

	for(var f=0; f< fn.length; f++){
		array = unsorted.slice(0);
		if(typeof fn[f] === 'function') {
			time = performance.now();
			fn[f](array, compare_fn);
			console.log(''+fn[f].name+': '+(performance.now()-time)+" ms");
		}else{
			console.log('error: '+fn[0]+' is not a function.');
			continue;
		}
		check_sort(array, sorted);
	}
	console.log('\n\n');
}

function linspace(start, end, count){
var array = [];
	for(var i=0; i<=count; i++) array[i]= start + (end-start)*i/count;
return array;
}

function shuffle(array){
var m = array.length, r;
	while(m--){r=~~(Math.random()*m);[array[m], array[r]] = [array[r], array[m]];}
return array;
}


/* Main */
var sample = [10,100,1000], size, sorted, unsorted, cmp;

for(size=0;size<sample.length; size++){
	sorted = linspace(0,10,sample[size]);
	unsorted = shuffle(sorted.slice(0));

	cmp = (a,b)=>{return a<b};
	benchmarksort(
		[quicksort,lampsort, dualpivot_quicksort,
		insertionsort,insertionsort_binary, insertionsort_binary2
		], cmp, unsorted);
}