// +build wasm js

package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
	"syscall/js"

	pdf "github.com/unidoc/unidoc/pdf/model"
)

type pdfOutBuffer struct {
	buffer *bytes.Buffer
	offset int64
}

func NewPdfOutBuffer(p []byte) *pdfOutBuffer {
	buff := bytes.NewBuffer(p)
	return &pdfOutBuffer{
		buffer: buff,
		offset: int64(buff.Len()),
	}
}

// implement Seeker for pdfOutBuffer
func (b *pdfOutBuffer) Seek(offset int64, whence int) (int64, error) {
	lastOffset := b.offset
	switch whence {
	case io.SeekStart:
		b.offset = offset
	case io.SeekCurrent:
		b.offset = b.offset + offset
	case io.SeekEnd:
		b.offset = int64(b.buffer.Len()) + offset
	}

	if b.offset < 0 {
		b.offset = lastOffset
		return b.offset, fmt.Errorf("seeking to offset before the start of buffer")
	}
	return b.offset, nil
}

// implement Writer for pdfOutBuffer
func (b *pdfOutBuffer) Write(p []byte) (n int, err error) {
	switch {
	case int64(b.buffer.Len()) == b.offset:
		n, err = b.buffer.Write(p)
	case int64(b.buffer.Len()) < b.offset:
		n, err = b.buffer.Write(make([]byte, b.offset-int64(b.buffer.Len())))
		if err != nil {
			return n, err
		}
		var m int
		m, err = b.buffer.Write(p)
		n += m
	case int64(b.buffer.Len()) > b.offset:
		tail, head := b.buffer.Bytes()[b.offset:], b.buffer.Bytes()[:b.offset]
		b.buffer = bytes.NewBuffer(head)
		n, err = b.buffer.Write(p)
		if err != nil {
			return n, err
		}
		var m int
		m, err = b.buffer.Write(tail)
		n += m
	}
	b.offset += int64(n)
	return n, err
}

var document = js.Global().Get("document")

func mergePdfs(this js.Value, args []js.Value) interface{} {
	files := js.Global().Get("uploadedFiles")
	len := files.Length()
	// output := make([]string, 5)
	pdfBuffer := NewPdfOutBuffer([]byte{})
	pdfWriter := pdf.NewPdfWriter()

	for i := 0; i < len; i++ {
		// println(files.Index(i).String())
		// output = append(output, files.Index(i).String())
		println("------- File: ", i)
		println(files.Index(i).String())
		fileBytes, err := base64.StdEncoding.DecodeString(files.Index(i).String())
		if err != nil {
			println(err)
			return err
		}
		fileReader := bytes.NewReader(fileBytes)
		pdfReader, err := pdf.NewPdfReader(fileReader)
		if err != nil {
			println(err)
			return err
		}

		numPages, err := pdfReader.GetNumPages()
		if err != nil {
			println(err)
			return err
		}

		for i := 0; i < numPages; i++ {
			pageNum := i + 1

			page, err := pdfReader.GetPage(pageNum)
			if err != nil {
				println(err)
				return err
			}

			err = pdfWriter.AddPage(page)
			if err != nil {
				println(err)
				return err
			}
		}
	}
	pdfWriter.Write(pdfBuffer)
	outBytes := pdfBuffer.buffer.Bytes()
	out := base64.StdEncoding.EncodeToString(outBytes)
	println("OUTPUT:", string(out))
	js.Global().Set("convertedFile", out)
	return nil
}

func imgsToPdf() {

}

func registerCallbacks() {
	js.Global().Set("mergePdfs", js.FuncOf(mergePdfs))
}

func main() {
	c := make(chan struct{}, 0)
	println("PDFtool initialized")

	registerCallbacks()
	<-c
}
