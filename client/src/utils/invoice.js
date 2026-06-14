import { jsPDF } from 'jspdf';

export function generateInvoicePDF({ pedido, items, subtotal, envio, total, direccion, cliente, factura_id }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;

  const primary = [108, 78, 209];
  const dark = [26, 26, 46];

  doc.setFillColor(...primary);
  doc.rect(0, 0, pageW, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PATITAS', margin, 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('FACTURA ELECTRONICA', pageW - margin, 9, { align: 'right' });

  let y = 24;

  doc.setTextColor(...dark);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', margin, y);
  y += 18;

  doc.setFillColor(245, 245, 250);
  doc.roundedRect(margin, y - 4, contentW, 28, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 120);
  doc.text(`Factura N°: ${factura_id || pedido?.pedido_id?.slice(0, 8)?.toUpperCase() || '---'}`, margin + 4, y + 4);
  doc.text(`Pedido N°: ${pedido?.pedido_id?.slice(0, 8)?.toUpperCase() || '---'}`, margin + 4, y + 12);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin + 4, y + 20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...dark);
  doc.text(`Total: Bs ${total.toFixed(2)}`, pageW - margin - 4, y + 12, { align: 'right' });

  y += 36;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primary);
  doc.text('DATOS DEL CLIENTE', margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...dark);
  const clienteInfo = [
    `Nombre: ${cliente?.nombre || '---'} ${cliente?.apellido || ''}`,
    `Email: ${cliente?.email || '---'}`,
    `Direccion: ${direccion?.calle || direccion || '---'}`,
    `Ciudad: ${direccion?.ciudad || '---'}${direccion?.estado ? `, ${direccion.estado}` : ''}`,
  ];
  clienteInfo.forEach((line, i) => {
    doc.text(line, margin, y + i * 5);
  });

  y += clienteInfo.length * 5 + 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primary);
  doc.text('DETALLE DEL PEDIDO', margin, y);
  y += 8;

  const colX = [margin, margin + 80, margin + 125, margin + 160];
  const colW = [80, 45, 35, 30];
  const colTitles = ['Producto', 'Cantidad', 'P. Unit.', 'Subtotal'];

  doc.setFillColor(...primary);
  doc.roundedRect(margin, y - 3, contentW, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  colTitles.forEach((t, i) => doc.text(t, colX[i] + 3, y + 3));

  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...dark);

  const renderItems = items || [];
  renderItems.forEach((item, idx) => {
    const name = item.nombre_producto || item.name || 'Producto';
    const qty = item.cantidad || item.quantity || 1;
    const price = item.precio_unitario || item.price || 0;
    const sub = qty * price;

    const rowY = y + idx * 6;

    if (idx % 2 === 0) {
      doc.setFillColor(248, 248, 252);
      doc.rect(margin, rowY - 2, contentW, 6, 'F');
    }

    const nameLines = doc.splitTextToSize(String(name), colW[0] - 4);
    doc.text(nameLines, colX[0] + 2, rowY + 2);
    doc.text(String(qty), colX[1] + 2, rowY + 2);
    doc.text(`Bs ${Number(price).toFixed(2)}`, colX[2] + 2, rowY + 2);
    doc.text(`Bs ${Number(sub).toFixed(2)}`, colX[3] + 2, rowY + 2);
  });

  y += (renderItems.length + 1) * 6;

  doc.setDrawColor(200, 200, 215);
  doc.line(margin, y, pageW - margin, y);
  y += 4;

  const totals = [
    { label: 'Subtotal', value: subtotal || total - (envio || 0) },
    { label: 'Envio', value: envio || 0 },
    { label: 'TOTAL', value: total, bold: true },
  ];

  totals.forEach((t) => {
    doc.setFont('helvetica', t.bold ? 'bold' : 'normal');
    doc.setFontSize(t.bold ? 11 : 9);
    doc.setTextColor(...(t.bold ? primary : dark));
    doc.text(t.label, pageW - margin - 60, y);
    doc.text(`Bs ${Number(t.value || 0).toFixed(2)}`, pageW - margin, y, { align: 'right' });
    y += t.bold ? 7 : 5;
  });

  y += 10;

  doc.setDrawColor(...primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 170);
  doc.text('Gracias por tu compra en Patitas. Si tienes dudas, contactanos a info@patitas.bo o al +591 777 12345.', margin, y, { maxWidth: contentW });

  doc.setFillColor(...dark);
  doc.rect(0, 285, pageW, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('Patitas - La Paz, Bolivia', margin, 292);
  doc.text('Pagina de demostracion', pageW - margin, 292, { align: 'right' });

  return doc;
}
