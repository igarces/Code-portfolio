/**
 * Created by igarces on 08/06/2016.
 */
class ConvertToKbFilter{

	constructor() {
		return ( (bytes) => {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)){
				bytes = 0;
			}
			return (bytes / 1024).toFixed(2) +  ' KB';
		});

	}
}
export default ConvertToKbFilter;
