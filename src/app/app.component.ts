import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFileName: string | null = null; // Variable pour stocker le nom du fichier sélectionné
  selectedFile: File | null = null; // Variable pour stocker le fichier sélectionné
  uploadMessage: string = ''; // Message à afficher après l'upload
  files: any[] = []; // Liste des fichiers disponibles

  constructor(private http: HttpClient) {} // Injecte HttpClient

  // Méthode appelée lorsque l'utilisateur sélectionne un fichier
  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Récupère le fichier sélectionné
    if (file) {
      this.selectedFileName = file.name; // Stocke le nom du fichier
      this.selectedFile = file; // Stocke le fichier
    } else {
      this.selectedFileName = null; // Réinitialise si aucun fichier n'est sélectionné
      this.selectedFile = null;
    }
  }

  // Méthode appelée lorsque l'utilisateur clique sur "Upload"
  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile); // Ajoute le fichier au FormData

      // Envoie le fichier au backend (à l'URL /upload)
      this.http.post('http://localhost:3000/upload', formData).subscribe(
        (response: any) => {
          this.uploadMessage = response.message || 'Fichier uploadé avec succès !';
        },
        (error) => {
          console.error('Erreur de réponse du serveur:', error);
          this.uploadMessage = 'Erreur lors de l\'upload du fichier.';
        }
      );
   
    } else {
      this.uploadMessage = 'Veuillez sélectionner un fichier.';
    }
  }

  // Méthode pour charger la liste des fichiers depuis le backend
  loadFiles() {
    this.http.get<any[]>('http://localhost:3000/files').subscribe(
      (files) => {
        this.files = files; // Met à jour la liste des fichiers
      },
      (error) => {
        console.error('Erreur lors de la récupération des fichiers', error);
      }
    );
  }

  // Méthode pour télécharger un fichier
  onDownload(fileId: number) {
    this.http.get(`http://localhost:3000/download/${fileId}`, { responseType: 'blob' }).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `file-${fileId}.gdb`; // Nom du fichier téléchargé
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors du téléchargement du fichier', error);
      }
    );
  }
}