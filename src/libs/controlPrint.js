import axios from 'axios';


export function printElementsById(elementIds) {
  var printWindow = window.open('', '', 'width=1024,height=1024');
  printWindow.document.open();
  printWindow.document.write('<html><head><title>Print</title></head><body>');

  let minus = 0;
  for (var i = 0; i < elementIds.length; i++) {
    var elementToPrint = document.getElementById(elementIds[i]);
    if (elementToPrint) {
      if (i === 0) {
        minus = i
      }else{
        minus = (minus + 30) - i;
      }
      printWindow.document.write('<div class="print-element" style="width:210mm; height: 250mm; background-image: url(/168182119131023762.png); background-repeat: no-repeat; background-size: cover;">' + 
      elementToPrint.innerHTML + 
      '</div></br></br></br></br></br>');
    } else {
      console.log('Element with id ' + elementIds[i] + ' not found.');
    }
  }
  // printWindow.document.write('<br></br>');
  // printWindow.document.write('<br></br>');
  // printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
}
export function printElementById(elementId) {
  var elementToPrint = document.getElementById(elementId);
  if (elementToPrint) {
    var printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write('<h1>Print Preview</h1>');
    printWindow.document.write('<hr>');
    printWindow.document.write(elementToPrint.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  } else {
    console.log('Element with id ' + elementId + ' not found.');
  }
}
export const print = (elementIds) => {
  window.onafterprint = function () {
    // Close the window after printing
    window.close();
  };
  var elementToPrint = document.getElementById(elementIds);
  var originalContents = document.body.innerHTML;
  var printContents = '';

  for (var i = 0; i < elementIds.length; i++) {
    var elementToPrint = document.getElementById(elementIds[i]);
    if (elementToPrint) {
      printContents += elementToPrint.innerHTML;
    } else {
      console.log('Element with id ' + elementIds[i] + ' not found.');
    }
  }

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;

}

// export async function printPreview(datasend) {
//   let url = `${process.env.REACT_APP_HOST_API_DOWNLOAD}/downLoadPrint`
//   try {
//     let bodyContent = JSON.stringify(datasend);
//     let reqOptions = {
//       url: url,
//       method: "POST",
//       data: bodyContent,
//       responseType: 'arraybuffer',
//       encoding: null,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     }
//     let res = await axios.request(reqOptions);
//     const htmlString = res.data; // Raw HTML content as a string
//     console.log(htmlString);
//     if (res.status == 200) {
//       let blob = new Blob([res.data], { type: 'application/pdf' });
//       var fileURL = URL.createObjectURL(blob);
//       console.log(fileURL);
//       saveAs(blob, "example.docx");
//     }
//   } catch (e) {
//     console.log(e);
//   }
// }

