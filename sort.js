// ugly globals
var swap_history = [], row = 0;

/*************************************************************/
function swap(array,i,j){
    [array[i], array[j]] = [array[j], array[i]];
    swap_history[row].push([i,j, array[i],array[j]]);
}
/*************************************************************/


function insertionsort(array, compare_fn){
	for(var i=0;i < array.length; i++){
		for(var j=i; j>0 && compare_fn(array[j-1],array[j]); j--){
			swap(array, j, j-1)
		}
	}
return array;
}

function insertionsort_binary(array, compare_fn){
	var search, value, start, end, middle, now;

    function moveupto(i,j){for(; i<j;i++){swap(array, i, i+1);}}
    function movedownto(j,i){for(; j>i;j--){swap(array, j, j-1);}}

	for(var sorted = 1; sorted < array.length; sorted++){
		value = array[sorted];
		start = 0;
		end = sorted-1;
        now = sorted;
		search=true;

		while(search){
            middle= ~~((end+start)/2 );
			if(compare_fn(array[middle],value)){
                if(now>middle) {
                    movedownto(now,middle);
                    now=middle;
                    end++;
                } else {
                    moveupto(now,middle-1);
                    now=middle-1;
                    start--;
                }
				end=middle-1;
			}else{
                if(now>middle) {
                    movedownto(now,middle+1);
                    now=middle+1;
                    start = middle+2
                    end++;
                } else {
                    moveupto(now,middle);
                    now=middle;
                    start=middle;
                    start++;
                }
				middle++;
			}
        if(( !compare_fn( array[now-1],value) ) 
             && ( compare_fn(array[now+1], value) || now==sorted) )
            search=false;

		}

	}
    return array;
}


function quicksort(array, compare_fn){
	function _quicksort(array, from, to, compare_fn){
		if (to - from > 0) {
		  for (var pivot = array[to], R = from, L=from; R < to; R++) {
			if (compare_fn(pivot, array[R])){
			  swap(array, R, L);
			  L++;
			}
		  }
		  swap(array, L, to);
		  _quicksort(array, from, L - 1, compare_fn);
		  _quicksort(array, L + 1, to, compare_fn);
		}
		return array;
	}
	return _quicksort(array, 0, array.length-1, compare_fn);
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
			swap(array, from, to);
		}
		for(cur = L = from+1, R = to-1; cur <= R; cur++) {
			if( compare_fn(pivot_min, array[cur]) ){
				swap(array, cur, L);
				L++;
			}else if( compare_fn(array[cur], pivot_maj) ){
				swap(array, cur, R);
				R--; cur--;	
			}
		}
		L--; R++;
		swap(array, L,from);
		swap(array, R, to);
		queue.pop();queue.pop();
		if(L - from > 1) queue.push(from, L-1);
		if(R - L > 2) queue.push(L+1, R-1);
		if(to - R > 1) queue.push(R+1, to);
		pending = queue.length-1;
	}
return array;
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
          swap(array, L,R);
          L++;
        }
      }
      swap(array, L,to);

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